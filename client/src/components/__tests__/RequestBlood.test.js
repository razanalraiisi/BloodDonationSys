import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import RequestBlood from '../RequestBlood';
import axios from 'axios';
// axios is mocked globally in setupTests; use the mocked instance here

const mockStore = configureStore([]);
const baseState = {
  users: { user: { email: 'john@example.com', fullName: 'John Doe', bloodType: 'O+' } },
};

const renderRequest = (state = baseState) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <Router>
        <RequestBlood />
      </Router>
    </Provider>
  );
};

// Pin "today" for snapshots so dynamic min date is stable
beforeAll(() => {
  // Pin date to today's date to match UI (min date updates daily)
  jest.useFakeTimers({ now: new Date('2025-12-11T00:00:00Z') });
});
afterAll(() => {
  jest.useRealTimers();
});

// Provide axios responses used by RequestBlood effects
beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/api/donation-centers')) {
      return Promise.resolve({ data: [{ _id: '1', name: 'Royal Hospital' }] });
    }
    return Promise.resolve({ data: {} });
  });
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('RequestBlood Form', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ _id: '1', name: 'City Hospital' }] });
    // Profile load
    jest.spyOn(axios, 'post').mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders and autofills self mode fields from user', async () => {
    const { container } = renderRequest();

    // Email and Full Name inputs are readOnly in self mode; verify values
    const inputs = container.querySelectorAll('input.auth-input');
    const emailInput = inputs[0];
    const nameInput = inputs[1];
    expect(emailInput).toHaveValue('john@example.com');
    expect(nameInput).toHaveValue('John Doe');

    // Blood type select is disabled in self mode
    const bloodSelect = container.querySelector('select.auth-input');
    expect(bloodSelect).toBeDisabled();

    // Hospital select should load options
    await waitFor(() => expect(container.querySelectorAll('select.auth-input')[1].querySelectorAll('option').length).toBeGreaterThan(1));
  });

  test('matches RequestBlood UI snapshot', () => {
    const { container } = renderRequest();
    expect(container).toMatchSnapshot();
  });

  test('submits with valid inputs and shows success message', async () => {
    const { container } = renderRequest();

    // Mock submission
    axios.post.mockResolvedValueOnce({ data: [] }); // profile
    axios.post.mockResolvedValueOnce({ data: {} }); // request submit

    // Fill optional numeric fields
    const patientIdInput = container.querySelector('input[type="number"][min="0"]');
    await userEvent.type(patientIdInput, '123');

    const numberInputs = container.querySelectorAll('input[type="number"][min="0"]');
    const hospitalFileInput = numberInputs[1];
    await userEvent.type(hospitalFileInput, '456');

    // Hospital select (second select element)
    const selects = container.querySelectorAll('select.auth-input');
    const hospitalSelect = selects[1];
    await waitFor(() => expect(hospitalSelect.querySelectorAll('option').length).toBeGreaterThan(1));
    await userEvent.selectOptions(hospitalSelect, 'City Hospital');

    // Date required: set today (min set inside component)
    const dateInput = container.querySelector('input[type="date"]');
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    await userEvent.type(dateInput, `${y}-${m}-${d}`);

    // Reason
    const reasonInput = container.querySelectorAll('input.auth-input')[6];
    await userEvent.type(reasonInput, 'Surgery');

    // Blood Units
    const bloodUnitsInput = container.querySelectorAll('input[type="number"][min="0"]')[2];
    await userEvent.type(bloodUnitsInput, '2');

    // Urgency radios: default Normal; switch to Urgent
    const urgencyRadios = container.querySelectorAll('input[type="radio"]');
    await userEvent.click(urgencyRadios[urgencyRadios.length - 2]); // Urgent radio

    // Submit
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitBtn);

    await waitFor(() => expect(screen.getByText(/request submitted successfully/i)).toBeInTheDocument());
  });

  test('renders expected static fields without snapshot', () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    const { container } = renderRequest();
    expect(screen.getByText(/date required/i)).toBeInTheDocument();
    const dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toBeInTheDocument();
    const selects = container.querySelectorAll('select.auth-input');
    expect(selects.length).toBeGreaterThan(0);
    // Skip asserting dynamic min date to avoid day-to-day drift
  });
});

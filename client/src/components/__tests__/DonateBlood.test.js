import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import DonateBlood from '../DonateBlood';

import axios from 'axios';

// Mock axios to avoid ESM import issues and control async effects
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Silence router future flag warnings in test output
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  // @ts-ignore
  console.warn.mockRestore && console.warn.mockRestore();
});

// Provide default axios responses used by DonateBlood effects
beforeEach(() => {
  axios.post.mockImplementation((url) => {
    if (url.includes('/donation/mine')) {
      return Promise.resolve({ data: [] }); // no previous donations => eligible
    }
    if (url.includes('/donation/create')) {
      return Promise.resolve({ data: { ok: true } });
    }
    if (url.includes('/request/updateStatus')) {
      return Promise.resolve({ data: { ok: true } });
    }
    return Promise.resolve({ data: {} });
  });
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

const mockStore = configureStore([]);

const baseState = {
  users: {
    user: { email: 'john@example.com', fullName: 'John Doe', bloodType: 'O+' },
    isSuccess: false,
    isError: false,
  },
};

const renderDonate = (state = baseState) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <Router>
        <DonateBlood />
      </Router>
    </Provider>
  );
};

describe('DonateBlood Form', () => {
  test('renders core fields and submit button', () => {
    renderDonate();

    expect(screen.getByText(/donate blood form/i)).toBeInTheDocument();
    expect(screen.getByText(/donor:/i)).toBeInTheDocument();

    // Hospital file number
    expect(screen.getByPlaceholderText(/hfn-123456/i)).toBeInTheDocument();

    // Donation type radios
    expect(screen.getByText(/type of donation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();

    // Preferred hospital select
    expect(screen.getByText(/preferred hospital/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('initially disables submit until required fields are set', () => {
    renderDonate();
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  test('matches DonateBlood UI snapshot', () => {
    const { container } = renderDonate();
    expect(container).toMatchSnapshot();
  });

  test('enables submit after valid inputs and mocks centers', async () => {
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ _id: '1', name: 'Center A' }] });
    // First post used by eligibility check; return empty list to be eligible immediately
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: [] });
    // Subsequent post for donation submit
    axios.post.mockResolvedValue({ data: {} });

    const { container } = renderDonate();

    // Health radios: set to pass
    await userEvent.click(container.querySelectorAll('input[name="feelingWell"]')[0]); // Yes
    await userEvent.click(container.querySelectorAll('input[name="healthChanges"]')[1]); // No
    await userEvent.click(container.querySelectorAll('input[name="medication"]')[1]); // No
    await userEvent.click(container.querySelectorAll('input[name="chronicIllness"]')[1]); // No

    // Donation type: Whole Blood
    await userEvent.click(container.querySelectorAll('input[name="donationType"]')[0]);

    // Hospital selection and file number
    const hospitalSelect = container.querySelector('select');
    await userEvent.selectOptions(hospitalSelect, 'Center A');

    const fileInput = screen.getByPlaceholderText(/hfn-123456/i);
    await userEvent.type(fileInput, 'HFN-9999');

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await userEvent.click(submitBtn);
  });
});

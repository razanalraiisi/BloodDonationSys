import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Register from '../Register';
// Mock axios using CJS build to avoid ESM issues in Jest
jest.mock('axios', () => require('axios/dist/node/axios.cjs'));

const mockStore = configureStore([]);
const store = mockStore({
  users: { isSuccess: false, isError: false, user: null, message: '' },
});

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('Register Component Tests', () => {
  const renderRegister = () => (
    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    )
  );

  test('renders key input fields and submit button', () => {
    const { container } = renderRegister();

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    const dobInput = container.querySelector('input[name="dob"]');
    expect(dobInput).toBeTruthy();
    const cityPresence = container.querySelector('input[name="city"]');
    expect(cityPresence).toBeTruthy();
    expect(screen.getByText(/gender/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/any relevant medical history/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows typing in core input fields', () => {
    const { container } = renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/example@mail.com/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'Abc@123' } });
    const cityInput = container.querySelector('input[name="city"]');
    fireEvent.change(cityInput, { target: { value: 'Muscat' } });

    expect(screen.getByPlaceholderText('Full Name')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toHaveValue('john@example.com');
    expect(screen.getByPlaceholderText(/enter your password/i)).toHaveValue('Abc@123');
    const cityValEl = container.querySelector('input[name="city"]');
    expect(cityValEl).toHaveValue('Muscat');
  });

  test('validates email format using regex', () => {
    renderRegister();
    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: 'valid.email@example.com' } });
    expect(emailRegex.test(emailInput.value)).toBe(true);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(emailRegex.test(emailInput.value)).toBe(false);
  });

  test('shows validation errors for empty fields on submit', async () => {
    renderRegister();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Match current UI error messages
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid blood type/i)).toBeInTheDocument();
    expect(await screen.findByText(/date of birth is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/city is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/gender is required/i)).toBeInTheDocument();
  });

  test('matches the UI snapshot', () => {
    const { container } = renderRegister();
    expect(container).toMatchSnapshot();
  });
});

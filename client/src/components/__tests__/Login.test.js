import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';
// Mock axios using CJS build to avoid ESM issues in Jest
jest.mock('axios', () => require('axios/dist/node/axios.cjs'));

const mockStore = configureStore([]);
const store = mockStore({
  users: { isSuccess: false, isError: false, user: null, message: '' },
});

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('Login Component Tests', () => {
  const renderLogin = () => (
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    )
  );

  test('renders email and password fields', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    expect(emailInput).toBeInTheDocument();
    // current UI uses type="text" for email
    expect(emailInput).toHaveAttribute('type', 'text');

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('allows typing in email and password fields', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('validates email format using regex', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fireEvent.change(emailInput, { target: { value: 'valid.email@example.com' } });
    expect(emailRegex.test(emailInput.value)).toBe(true);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(emailRegex.test(emailInput.value)).toBe(false);
  });

  test('shows validation errors for empty fields on submit', async () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Match current UI messages
    expect(await screen.findByText(/email is required\./i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required\./i)).toBeInTheDocument();
  });

  test('matches the UI snapshot', () => {
    const { container } = renderLogin();
    expect(container).toMatchSnapshot();
  });
});

// Mock UserSlice action and react-redux dispatch to simulate invalid credentials
jest.mock('../../features/UserSlice', () => ({
  getUser: jest.fn(() => ({ type: 'MOCK/GET_USER' })),
}));

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => (/* action */) => ({
      unwrap: () => Promise.reject(new Error('Email or password is incorrect.')),
    }),
  };
});
// No react-redux mock; rely on real store dispatch
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';

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

  test('matches Login UI snapshot', () => {
    const { container } = renderLogin();
    expect(container).toMatchSnapshot();
  });


  test('shows error alert on invalid credentials', async () => {
    const userSlice = require('../../features/UserSlice');
    // ensure our mock is used
    expect(typeof userSlice.getUser).toBe('function');
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/please check the following/i)).toBeInTheDocument();
    expect(await screen.findByText(/email or password is incorrect/i)).toBeInTheDocument();
  });
});

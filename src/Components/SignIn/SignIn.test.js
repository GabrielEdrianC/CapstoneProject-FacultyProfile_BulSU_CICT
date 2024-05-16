import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mock the Firebase authentication functions
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

let pathname = '';
const { Login } = window;
delete window.location;
window.location = Object.defineProperty({}, 'pathname', {
  get: () => pathname,
  set: (value) => {
    pathname = value;
  },
});

describe('SignIn Component', () => {
  it('renders the component', () => {
    const { getByPlaceholderText } = render(<SignIn />);
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('should do something when a specific condition is met', () => {
    // Arrange: Set up any necessary data or components
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    const emailInput = getByPlaceholderText('Email');

    // Act: Perform the action you are testing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' }});

    // Assert: Check if the expected behavior occurs
    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles registration successfully', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(<SignIn/>);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByRole('button', { name: 'Register' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });

    fireEvent.click(registerButton);
  });

  it('handles registration failure', async () => {
    const { getByPlaceholderText, getByRole, findByText } = render(<SignIn/>);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByRole('button', { name: 'Register' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-email' });

    fireEvent.click(registerButton);

    const errorMessage = await findByText('Invalid email address!');
    expect(errorMessage).toBeInTheDocument();
  });

  it('calls the post function after successful registration', async () => {
    const { getByPlaceholderText, getByRole } = render(<SignIn/>);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByRole('button', { name: 'Register' });

    // Mock the post function
    const performPostAction = jest.fn();
    SignIn.prototype.performPostAction = performPostAction;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });

    fireEvent.click(registerButton);

   
  });
});

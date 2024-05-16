import React from 'react';
import { render,  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from './Login';


describe('Login Component', () => {
    it('renders the component for EMAIL', () => {
        const { getByPlaceholderText } = render(<Login />);
        expect(getByPlaceholderText('Email')).toBeInTheDocument();
      });
      it('renders the component for PASSWORD', () => {
        const { getByPlaceholderText } = render(<Login />);
        expect(getByPlaceholderText('Password')).toBeInTheDocument();
      });
      it('renders the component  for CHECKBOX', () => {
        const { getByPlaceholderText } = render(<Login />);
        expect(getByPlaceholderText('checkbox')).toBeInTheDocument();
      });
      it('renders the component for FORGOT PASSWORD', () => {
        const { getByPlaceholderText } = render(<Login />);
        expect(getByPlaceholderText('forgot')).toBeInTheDocument();
      });
      it('renders the component for SIGN UP', () => {
        const { getByPlaceholderText } = render(<Login />);
        expect(getByPlaceholderText('signUp')).toBeInTheDocument();
      });
});
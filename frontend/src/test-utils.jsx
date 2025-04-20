// src/test-utils.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { AuthContext } from './components/AuthContext';

// Wrap render to include global context providers, etc.
const AllProviders = ({ children }) => (
  <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: () => {} }}>
    {children}
  </AuthContext.Provider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

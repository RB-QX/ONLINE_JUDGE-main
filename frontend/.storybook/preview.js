// .storybook/preview.js
import React from 'react';
import { AuthContext } from '../src/components/AuthContext';

export const decorators = [
  Story => (
    <AuthContext.Provider value={{ isLoggedIn: true }}>
      <Story />
    </AuthContext.Provider>
  ),
];

// src/components/recommendations/Problems.test.jsx
import React from 'react';
import { render, screen } from '../../test-utils';
import RecommendedProblems from './Problems';

test('renders recommended problems from API', async () => {
  render(<RecommendedProblems />);
  // Initially shows loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Eventually, mocked data appears
  expect(await screen.findByText('Graph DP')).toBeInTheDocument();
  expect(screen.getByText('Medium')).toBeInTheDocument();
});

// src/components/recommendations/Problems.integration.test.jsx
import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import RecommendedProblems from './Problems';

test('removes solved problem after solve action', async () => {
  render(<RecommendedProblems />);
  // verify initial problem
  expect(await screen.findByText('Graph DP')).toBeInTheDocument();

  // Override handler: now return empty list
  server.use(
    rest.get('/api/recommendations', (req, res, ctx) =>
      res(ctx.json({ problems: [], contests: [], peers: [], tags: [] }))
    )
  );

  // Simulate user clicking the problem link
  screen.getByText('Graph DP').click();

  // On refetch, problem no longer appears
  await waitFor(() => {
    expect(screen.queryByText('Graph DP')).not.toBeInTheDocument();
  });
});

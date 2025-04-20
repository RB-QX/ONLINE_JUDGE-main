// src/mocks/handlers.js
import { rest } from 'msw';

// Mock data for recommendations endpoint
const recommendations = {
  problems: [
    { itemId: { _id: 'p1', title: 'Graph DP', difficulty: 'Medium' }, score: 1.2 },
    { itemId: { _id: 'p2', title: 'Two‑Sum', difficulty: 'Easy' }, score: 0.8 },
  ],
  contests: [],
  peers: [],
  tags: [],
};

export const handlers = [
  // Intercept GET /api/recommendations
  rest.get('/api/recommendations', (req, res, ctx) => {
    return res(ctx.json(recommendations));
  }),
];

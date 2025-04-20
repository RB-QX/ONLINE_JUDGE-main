// stories/RecommendedProblems.stories.jsx
import React from 'react';
import RecommendedProblems from '../src/components/recommendations/Problems';
import { handlers } from '../src/mocks/handlers';
import { rest } from 'msw';

export default {
  title: 'Recommendations/Problems',
  component: RecommendedProblems,
  parameters: {
    msw: handlers,    // use MSW handlers in Storybook :contentReference[oaicite:5]{index=5}
  },
};

const Template = args => <RecommendedProblems {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: handlers,
};

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    rest.get('/api/recommendations', (req, res, ctx) =>
      res(ctx.json({ problems: [], contests: [], peers: [], tags: [] }))
    ),
  ],
};

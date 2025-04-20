// src/setupTests.js

// Polyfill TextEncoder and TextDecoder for MSW in Jest
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';          // Adds custom jest matchers
import { server } from './mocks/server';     // MSW server instance

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers declared during tests (for one‑off error mocks).
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

/**
 * Vitest setup file
 * Configures mocks and global test utilities
 */

import { vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables for testing
process.env.FINASHOPPING_API_URL = 'https://api.test.finashopping.uy';
process.env.FINASHOPPING_SERVICE_USERNAME = 'test-user';
process.env.FINASHOPPING_SERVICE_PASSWORD = 'test-password';

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

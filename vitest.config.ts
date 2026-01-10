import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/index.ts',
        'src/http.ts',
        'src/api/client.ts', // API client requires real authentication
        'src/api/types.ts',  // Type definitions only
        // Tools now have execution tests with mocked API
        'src/resources/*.ts', // Resource handlers require API mocking
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
    setupFiles: ['./tests/setup.ts'],
  },
});

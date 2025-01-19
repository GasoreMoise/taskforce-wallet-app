module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/mocks/'
    ],
    coverageReporters: ['text', 'lcov', 'clover'],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 30000,
    moduleFileExtensions: ['js', 'json'],
    watchPathIgnorePatterns: [
      'node_modules',
      'coverage'
    ],
    globals: {
      NODE_ENV: 'test'
    }
  }; 
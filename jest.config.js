module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts'
};

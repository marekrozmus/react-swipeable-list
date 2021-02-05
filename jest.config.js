// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.js', '!src/__tests__/*.*'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.test.js']
};

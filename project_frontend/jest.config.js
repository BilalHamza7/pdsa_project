// jest.config.js
module.exports = {
    testEnvironment: 'jsdom', // simulates browser environment for React tests
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Use babel-jest for JSX/TSX files
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],  // For better DOM assertions
  };
  
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  testMatch: ["<rootDir>/src/**/*.test.js"],
  moduleNameMapper: {
    axios: "axios/dist/node/axios.cjs",
  },
};

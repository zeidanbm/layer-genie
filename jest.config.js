/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  coverageDirectory: "coverage",
  // setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  setupFiles: ["./__mocks__/client.js"],
  collectCoverageFrom: [
    "src/*.{ts,js}",
    "!src/*.d.ts",
    "!src/constants.ts",
    "!src/logger.ts",
  ],
};

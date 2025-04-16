module.exports = {
  verbose: true,
  testEnvironment: "jsdom", 
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    'msw/node': '<rootDir>/node_modules/msw/lib/node',}
};
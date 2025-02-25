module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/migrations/*.ts'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  collectCoverage: true,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/modules/$1',
  },
  testPathIgnorePatterns: ['/node_modules/'],
};
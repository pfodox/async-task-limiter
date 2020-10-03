module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    '!src/**/(__tests__)/*.ts',
  ],
  coverageDirectory: 'artifacts',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts', '<rootDir>/tests/**/*.test.ts'],
  moduleFileExtensions: ['js','ts'],
};

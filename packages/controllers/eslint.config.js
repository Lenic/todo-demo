import globals from 'globals';
import lint from 'typescript-eslint';
import globalSettings from '../../eslint.config.js';

export default [
  ...globalSettings,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: lint.parser,
        projectService: true,
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    { ignores: ['**/dist'] },
    {
      extends: [
        js.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
        importPlugin.flatConfigs.recommended,
      ],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: globals.browser,
        parserOptions: {
          project: ['./tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      plugins: {
        'unused-imports': unusedImports,
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        // sort imports and exports
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // only import
              ['^'],
              // type import
              ['^.*\\u0000$'],
              // external
              ['^@?\\w'],
              // internal
              ['^@(/.*|$)'],
              // parents
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // brother
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // style
              ['^.+\\.css$', '^.+\\.less$', '^.+\\.scss$', '^.+\\.postcss$', '^.+\\.sass$'],
            ],
          },
        ],
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'import/namespace': 'off',
        'import/no-unresolved': 'off',
        'import/export': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-duplicates': 'off',
        // autoremove unused imports
        'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ),
];

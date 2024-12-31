import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import lint from 'typescript-eslint';

export default [
  ...lint.config(
    { ignores: ['**/dist'] },
    {
      extends: [
        js.configs.recommended,
        ...lint.configs.strictTypeChecked,
        ...lint.configs.stylisticTypeChecked,
        importPlugin.flatConfigs.recommended,
      ],
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
        // auto remove unused imports
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
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    eslintConfigPrettier,
  ),
];

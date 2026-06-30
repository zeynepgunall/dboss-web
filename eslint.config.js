import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      // Allow extracting a prop only to omit it via `...rest` (e.g. dropping
      // react-markdown's `node` before spreading props onto a DOM element).
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  // Keep last: turns off ESLint formatting rules that conflict with Prettier.
  prettier,
]);

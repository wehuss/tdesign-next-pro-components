import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/strongly-recommended'],
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
      },
      globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // DOM types
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        // TDesign components
        Button: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue,
      prettier,
    },
    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/no-setup-props-destructure': 'off',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',

      // General rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 版本
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: tsParser,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.changeset/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
      'raw/**',
    ],
  },
]

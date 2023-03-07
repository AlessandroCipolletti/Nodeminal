module.exports = {
  env: {
    browser: true,
    es6: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'wesbos',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
    }],
    semi: ['error', 'never'],
    'no-param-reassign': 'off',
    'prettier/prettier': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'import/no-unresolved': 'error',
  },
}

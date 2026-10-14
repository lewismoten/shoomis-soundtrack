import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'script'
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['index*.js', 'soundtrack-webaudio.js'],
    rules: {
      // The restored browser player retains optional hooks shared by its script files.
      'no-unused-vars': 'warn'
    }
  }
];

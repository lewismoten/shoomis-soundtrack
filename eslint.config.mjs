import globals from 'globals';

export default [
  {
    files: ['src/**/*.js', 'vite.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['src/player/index*.js', 'src/player/soundtrack-webaudio.js'],
    languageOptions: {
      sourceType: 'script'
    },
    rules: {
      // The restored browser player retains optional hooks shared by its script files.
      'no-unused-vars': 'off'
    }
  }
];

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
<<<<<<< HEAD
  plugins: ['@typescript-eslint/eslint-plugin'],
=======
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
<<<<<<< HEAD
=======
    '@typescript-eslint/no-unused-vars': 'off',
>>>>>>> bba244e4316370d6ff519e72f0e31ce1a9583272
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        semi: true,
        printWidth: 120,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'avoid',
        avoidEscape: true,
      },
    ],
    // ? nestjs 기본 eslint
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // ! 사용되지 않는 변수에 대한 경고를 무시합니다.
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error', // ! any 타입을 사용하면 에러를 발생시킵니다.
    'no-unused-vars': 'off',
    // ! 추가
    camelcase: 'warn', // ! 카멜케이스를 사용하지 않으면 경고를 발생시킵니다.
    'spaced-comment': 'warn', // !  주석에 공백을 사용하면 경고를 발생시킵니다.
    quotes: ['error', 'single', { allowTemplateLiterals: true }], // ! 따옴표 사용 & 템플릿 리터럴 허용
    'no-duplicate-imports': 'error', // ! 중복된 import를 사용하면 에러를 발생시킵니다.
    '@typescript-eslint/no-empty-function': 'warn', // ! 빈 함수를 사용하면 경고를 발생시킵니다.
    // ! ts-ignore, ts-expect-error, ts-nocheck, ts-check를 사용하면 에러를 발생시킵니다.
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 3,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'off', // ! 클래스 멤버 접근 제한자를 사용하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/explicit-function-return-type': 'off', // ! 함수의 반환 타입을 명시하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/no-parameter-properties': 'off', // ! 생성자의 매개변수에 접근 제한자를 사용하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/explicit-module-boundary-types': 'off', // ! 모듈의 반환 타입을 명시하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/no-use-before-define': 'off', // ! 변수를 선언하기 전에 사용하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/no-var-requires': 'off', // ! require를 사용하지 않으면 경고를 발생시킵니다.
    '@typescript-eslint/ban-types': 'off', // ! 타입을 사용하지 않으면 경고를 발생시킵니다.
  },
};

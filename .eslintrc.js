module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'vue/require-prop-type-constructor': 'warn',
    'vue/require-v-for-key': 'warn',
    'no-useless-escape': 'warn',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    semi: ['error', 'always'],
    'dot-notation': 'off',
    eqeqeq: ['off'],
    'lines-between-class-members': 'off',
    'no-undef': 'off',
    'spaced-comment': 'off',
    'prefer-const': 'off',
    curly: 'off'
  }
};

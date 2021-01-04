module.exports = {
  extends: [
    require.resolve('stylelint-config-standard'),
    require.resolve('stylelint-config-css-modules'),
    require.resolve('stylelint-config-rational-order'),
    require.resolve('stylelint-config-prettier'),
  ],
  plugins: [
    require.resolve('stylelint-order'),
    require.resolve('stylelint-declaration-block-no-ignored-properties'),
  ],
  rules: {
    'no-descending-specificity': null,
    'function-calc-no-invalid': null,
    'function-url-quotes': 'always',
    'font-family-no-missing-generic-family-keyword': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};

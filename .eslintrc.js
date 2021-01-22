module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  settings: {
    webpack: {
      config: require.resolve('@vue/cli-service/webpack.config.js'),
    },
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['state'] }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

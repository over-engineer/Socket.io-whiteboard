module.exports = {
    env: {
        es6: true,
        browser: true,
    },
    extends: [
        'airbnb-base'
    ],
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        'no-underscore-dangle': 'off',
        'no-console': 'off',
    },
};

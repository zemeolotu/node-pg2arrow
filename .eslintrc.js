module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 11,
    },
    rules: {
        indent: ['error', 4],
        'max-len': ['error', { code: 120, tabWidth: 4 }],
        'no-underscore-dangle': ['off'],
        'object-curly-newline': ['off'],
        'arrow-parens': ['error', 'as-needed'],
        'import/prefer-default-export': ['off'],
    },
};

module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    //'eslint:recommended',
    '@vue/typescript'
  ],
  rules: {
    //'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-console': 'off',
    //'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
		'no-debugger': 'off',
		//'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'off'
		'vue/no-unused-components': 'off',
		//'vue/require-prop-type-constructor': process.env.NODE_ENV === 'production' ? 'error' : 'off'
		'vue/require-prop-type-constructor': 'off',
    'vue/no-use-v-if-with-v-for': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}

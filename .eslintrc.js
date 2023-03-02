module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      "error",
      {
        "vars": "all",
        "args": "all",
        "varsIgnorePattern": "^[A-Z]",
        "argsIgnorePattern": "^_",
      },
    ],
    'react/require-default-props': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    'no-return-assign': ['off'],
    'arrow-body-style': ['warn'],
    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/lines-between-class-members': ['off'],
    'react/style-prop-object': ['off'],
    'global-require': ['off'],
    'react/no-array-index-key': ['off'],
    'react-native/no-inline-styles': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    'react/prop-types': ['off'],
    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['off', {'devDependencies': true}],
    'no-plusplus': ['off'],
    'react-hooks/exhaustive-deps': 'warn',
    'no-param-reassign': ['off'],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal'],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ]
  },
};

import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import pluginJs from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxa11y from 'eslint-plugin-jsx-a11y';

const javascriptRecommended = pluginJs.configs.recommended;

const files = ['**/*.js', '**/*.jsx'];

const fixedA11y = fixupPluginRules(jsxa11y);
const jsxa11yRecommended = {
  files,
  plugins: {
    'jsx-a11y': fixedA11y,
  },
  rules: {
    ...fixedA11y.configs.strict.rules,
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
};

const promiseRecommended = {
  files,
  plugins: {
    promise: fixupPluginRules(promise),
  },
};

const reactHooksRecommended = {
  files,
  plugins: {
    'react-hooks': fixupPluginRules(reactHooks),
  },
};

const prettierRules = {
  files,
  plugins: {
    prettier,
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {},
      {
        usePrettierrc: true,
      },
    ],
  },
};

const importRules = {
  files,
  plugins: {
    import: fixupPluginRules(_import),
  },
  rules: {
    'import/prefer-default-export': 'off',

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.jsx', '**/*.test.js', '**/render-provider.jsx'],
      },
    ],
  },
};

// Custom rules
const jointflowsReact = {
  files,
  ...reactRecommended,
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...reactRecommended.rules,
    'react/destructuring-assignment': 2,
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/require-default-props': 'off',
  },
};

const jointflowsCustomOverrides = [
  {
    files,
    rules: {
      'no-alert': 1,
      'no-param-reassign': 1,
      'no-await-in-loop': 1,
      'no-console': 1,
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],

      'no-restricted-globals': [
        'error',
        {
          name: 'jest',
          message: 'Use `vi` instead',
        },
      ],

      'no-restricted-properties': [
        'error',
        {
          object: 'maths',
          property: 'evaluate',
          message: 'Please do not use evaluate, use the chainers or expressions instead.',
        },
        {
          object: 'screen',
          property: 'debug',
          message: 'Please remove it when you are done debugging.',
        },
      ],
      curly: [2, 'multi-line'],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

const temporaryDisable = [
  {
    files,
    rules: {
      'react/prop-types': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'jsx-a11y/iframe-has-title': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-prototype-builtins': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-param-reassign': 'off',
      'no-useless-escape': 'off',
    },
  },
];

const eslintIgnore = {
  ignores: [
    'vite.config.js',
    'vitest.setup.js',
    'eslint.config.js',
    '**/.idea',
    '**/.vscode',
    '**/build',
    '**/coverage',
    '**/node_modules',
    '**/public',
  ],
};

// Assemble the config
export default [
  eslintIgnore,
  { files: ['**/*.{js,jsx}'] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: { ...globals.browser, vi: true, process: "readonly" } } },
  javascriptRecommended,

  // Plugins
  jsxa11yRecommended,
  promiseRecommended,
  reactHooksRecommended,
  importRules,
  prettierRules,

  // jointFlows custom rules
  jointflowsReact,

  ...jointflowsCustomOverrides,
  ...temporaryDisable,
];

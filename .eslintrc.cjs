/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'semi': ['error', 'never'],
    'prettier/prettier': 'off',
    'eqeqeq': 'error', // 要求使用===和!==
    'quotes': ['error', 'single'], // 使用单引号
    'spaced-comment': [ // 注释风格
      'error',
      'always',
      {
        'line': {
          'markers': ['/'],
          'exceptions': ['-', '+']
        },
        'block': {
          'markers': ['!'],
          'exceptions': ['*'],
          'balanced': true
        }
      }
    ],
    'vue/max-attributes-per-line': [// 强制html标签每行属性的最大数量
      'warn',
      {
        'singleline': {
          'max': 6
        },
        'multiline': {
          'max': 1
        }
      }
    ],
    'vue/html-indent': ['error', 2], // 在<template>中强制一致缩进
    'vue/html-self-closing': ['error', { // 执行自闭合的风格,<div/>
      'html': {
        'void': 'never',
        'normal': 'always',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'no-unused-vars': 'off', // 变量未使用就报红
    '@typescript-eslint/no-unused-vars': ['off', {
      "varsIgnorePattern": "^T$"
    }], // 可以解决枚举enum报错问题，变量未使用也可以正常报错
    'indent': [ // 强制使用一致的缩进
      'error',
      2,
      {
        'MemberExpression': 0,
        'SwitchCase': 1,
        'ignoredNodes': ['TemplateLiteral']
      }
    ],
    'array-bracket-newline': ['warn', 'consistent'], // 数组中括号换行统一
    'comma-dangle': ['error', 'never'], // 对象最后一个属性后面不能有逗号
    'comma-spacing': ['error', { before: false, after: true }], // 逗号后面加上空格
    'key-spacing': ['error', { beforeColon: false }], // 对象key冒号后面要有一个空格
    'array-bracket-spacing': ['error', 'never'], // 数组中括号旁边不能有空格
    'object-curly-spacing': ['error', 'always'], // 对象中大括号旁边必须有空格
    // "object-property-newline": ["error", {allowAllPropertiesOnSameLine: false}],
    // "object-curly-newline": ["error", "always"], // 对象的花括号和其它符号之间出现换行符
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }], // 不允许空行
    'no-multi-spaces': 'error',
    'arrow-spacing': 'error', // 箭头函数的箭头前后都有空格
    'space-before-function-paren': ['error', 'always'], // 函数括号前面加空格
    'space-infix-ops': ['error'], // === 等这种中缀操作符周围有空格
    'vue/multi-word-component-names': 'off'
  }
}

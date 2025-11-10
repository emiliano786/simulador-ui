import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import exos from 'eslint-plugin-exos';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  { plugins: { exos }, rules: { 'exos/data-test': 'error' } },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false,
          ignores: []
        }
      ],
      'no-undef': 'off' // global variables are allowed
    }
  }
];

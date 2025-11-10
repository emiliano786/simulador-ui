/** @type {import('tailwindcss').Config} */
import { TailwindPreset } from '@alexochihua/exos-library-components';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  presets: [TailwindPreset]
};

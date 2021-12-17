const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    postcssImport(),
    tailwindcss(),
    postcssPresetEnv({
      browsers: 'last 1 Chrome versions',
    }),
  ],
};

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Caution: 競技用
        // corejs: '3',
        // useBuiltIns: 'usage',
        targets: ['last 1 Chrome versions'],
        modules: 'commonjs',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development',
      },
    ],
  ],
};

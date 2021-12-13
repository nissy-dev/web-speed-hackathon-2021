module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
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

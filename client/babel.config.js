module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        targets: ['last 1 Chrome versions'], // TODO: 競技用
        modules: 'commonjs',
        useBuiltIns: 'usage',
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

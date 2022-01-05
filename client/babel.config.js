module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 必要な分だけpolyfillを読み込むようにする
        useBuiltIns: 'usage',
        corejs: 3,
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

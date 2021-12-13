module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Caution: 競技用
        // targetsは対象バージョンをしていないと、ES5に変換する
        // ES5にない関数はpolyfillで埋め込む必要がある
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

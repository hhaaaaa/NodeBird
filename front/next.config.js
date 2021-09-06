const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enalbled: process.env.ANALYZER === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ],
      // module: {
      //   ...config.module,
      //   rules: [
      //     ...config.module.rules,
      //     {

      //     },
      //   ],
      // }, // immer 사용해서 변경해도 됨!
    };
  },
});
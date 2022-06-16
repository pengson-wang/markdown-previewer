//const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  webpack: {
    configure: {
      optimization: {
        chunkIds: 'named',
        minimize: false,
        // minimizer: [
        //   new TerserPlugin({
        //     terserOptions: {
        //       keep_classnames: true,
        //       keep_fnames: true,
        //       mangle: false,
        //     },
        //   }),
        // ],
      },
    },
  },
}

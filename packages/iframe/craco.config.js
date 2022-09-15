const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')

// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd())
const resolvePackage = (relativePath) => path.resolve(appDirectory, relativePath)

module.exports = {
  babel: {
    plugins: ['@babel/plugin-syntax-bigint', ['babel-plugin-styled-components', { ssr: false }]],
  },
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [resolvePackage('node_modules/hast-util-to-text')],
      },
    },
  ],
  webpack: {
    configure: {
      optimization: {
        chunkIds: 'named',
        minimize: false,
        // The Chrome Extension Admin prefer code without minimizer.
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

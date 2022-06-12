const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV ?? 'development',
  entry: {
    ['content-script']: './src/content-script/index.ts',
    background: './src/background/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        //include: path.resolve('./src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env'], '@babel/preset-typescript'],
            plugins: [
              'macros',
              ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
              [
                '@babel/plugin-transform-runtime',
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}

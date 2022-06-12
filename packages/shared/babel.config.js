module.exports = function (api) {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-typescript']
  const plugins = ['@babel/plugin-transform-runtime', 'macros', ['@babel/plugin-transform-typescript', { allowNamespaces: true }]]

  return {
    presets,
    plugins,
  }
}

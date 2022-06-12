module.exports = function (api) {
  api.cache(true)

  const presets = [['@babel/preset-env', { modules: 'auto' }], '@babel/preset-typescript']
  const plugins = ['macros', ['@babel/plugin-transform-typescript', { allowNamespaces: true }]]

  return {
    presets,
    plugins,
  }
}

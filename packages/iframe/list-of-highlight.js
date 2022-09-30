const fs = require('fs/promises')
const path = require('path')

async function listCssFrom(filepath) {
  const files = []
  const dirs = [filepath]
  const imgRegExp = /\.css$/i
  while (dirs.length > 0) {
    const dir = dirs.pop()
    if (dir) {
      const filesInDir = await fs.readdir(dir)
      for (const file of filesInDir) {
        const fullpath = path.join(dir, file)
        const stats = await fs.stat(fullpath)
        if (stats.isDirectory()) {
          dirs.push(fullpath)
        } else if (imgRegExp.test(file)) {
          files.push(fullpath)
        }
      }
    }
  }
  return files
}

;(async () => {
  try {
    const dir = path.resolve('../../node_modules/highlight.js/styles')
    const files = await listCssFrom(dir)
    const filesAsRelative = files.map((f) => path.relative(dir, f)).map((f) => f.replace(/\\/gi, '/'))
    const json = filesAsRelative.map((f) => ({
      path: f,
      name: f
        // .relative(dir, f)
        // .replaceAll(/[\\]+/g, ' ')
        .replace(/(\.css|-)/gi, ' ')
        .trim(),
    }))
    await fs.writeFile(path.resolve('src/constants/highlight-theme.json'), JSON.stringify(json, null, 2))
  } catch (err) {
    console.error(err)
  }
})()

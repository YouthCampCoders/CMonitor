// browser-async 的配置
const { resolve } = require('path')

const resoveDir = (...pathString) => resolve(__dirname, ...pathString)

const indexHtml = 'index.html'
const baseDir = resoveDir('../../')
const watchFileList = ['../../lib/**', '../../index.html'].map((s) =>
  resoveDir(s)
)

const browserConfig = {
  initConfig: {
    port: 3001,
    files: watchFileList,
    server: {
      baseDir,
      index: indexHtml
    }
  },
  watchConfig: {
    list: watchFileList,
    eventCallback: {
      change: async (filename) => {
        console.log(`Source file changed - ${filename}`)
      }
    }
  }
}

module.exports = browserConfig

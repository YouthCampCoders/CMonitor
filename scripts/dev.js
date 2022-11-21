const { build } = require('esbuild')
const { resolve } = require('path')
const args = require('minimist')(process.argv.slice(2))
const bs = require('browser-sync')
const { watchConfig, initConfig } = require('./config/browser-sync.config')

// 打包格式
const format = args.f || 'global'
// 打包入口
const pkg = require(resolve(__dirname, `../package.json`))

const outputFormat = format.startsWith('global') // 输出的格式
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'

const outfile = resolve(
  // 输出的文件
  __dirname,
  `../lib/index.${format}.js`
)

build({
  entryPoints: [resolve(__dirname, `../src/index.ts`)],
  outfile,
  bundle: true,
  // sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    // 监控文件变化
    onRebuild(error) {
      if (!error) console.log(`⚡⚡⚡rebuilt🚀🚀🚀`)
    }
  }
}).then(() => {
  console.log('watching⚡⚡⚡')
})

// 自动打开浏览器
bs.init(initConfig)
bs.watch(watchConfig.list).on('change', watchConfig.eventCallback['change'])

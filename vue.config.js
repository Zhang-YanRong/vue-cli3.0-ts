const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    '/' : '/',
  outputDir: 'dist',
  assetsDir: './src/assets',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.ts',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    },
    subpage: 'src/main.ts'
  },
  lintOnSave: true,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: true,
  configureWebpack: {},
  chainWebpack: config => {

    // console.log(config, 111)

    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })

    if (process.env.NODE_ENV === 'production') {
      // #region 启用GZip压缩
      config
        .plugin('compression')
        .use(CompressionPlugin, {
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          cache: true
        })
        .tap(args => {})
    }

    // config.resolve.alias
    //   .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    //   .set('_c', resolve('src/components'))
  },
  css: {
    modules: false,
    extract: true,
    sourceMap: false,
    loaderOptions: {}
  },
  // dll:false,
  devServer: {
    // host: 'localhost',
    // port: '8080',
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.35.235:8060/',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  parallel: require('os').cpus().length > 1,
  pwa: {},
  pluginOptions: {},
}

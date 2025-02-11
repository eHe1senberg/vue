const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
module.exports = {
  // transpileDependencies: true,
  lintOnSave: false, //关闭eslint检查
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      })
    ]
  },
  devServer: {
    proxy: {
      '/healthy': {
        target: `http://localhost:8087`,
        changeOrigin: true,
        pathRewrite: {
          '^/healthy': ''  //通过pathRewrite重写地址，将前缀/api转为''
        },
      }
    }
  },
}
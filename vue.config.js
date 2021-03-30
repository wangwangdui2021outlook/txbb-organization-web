/* eslint-disable */
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin")
const DAMAINCONFIG = require('./config/domainConfig/config')
module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? '/' : DAMAINCONFIG.CDNURL + '/organ/',
  assetsDir: 'static',
  outputDir: process.env.NODE_ENV === "development" ? 'devdist' : 'dist', // 不同的环境打不同包名
  productionSourceMap: false,
  devServer: {   // 配置服务器
    port: 7660,
    open: false,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://license.wangwangdui2021.com/Organ',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/cdn': {
        target: 'http://license.wangwangdui2021.com',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/cdn': ''
        }
      }
    },
    // 允许内网映射
    disableHostCheck: true
  },
  configureWebpack: {  // 覆盖webpack默认配置的都在这里
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
    },
    resolve: {   // 配置解析别名
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@a': path.resolve(__dirname, './src/api'),
        '@f': path.resolve(__dirname, './src/filters'),
        '@u': path.resolve(__dirname, './src/util'),
      }
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ]
  },
  css: {
    loaderOptions: {
      scss: {
        data: `@import "@/assets/util.scss";`
      }
    }
  }
}
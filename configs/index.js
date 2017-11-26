// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {     //built 是生存模式的版本
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    //assetsPublicPath: 'baidu.com',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {      //dev是开发模式的版本
    env: require('./dev.env'),
    port: 8989,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',//这里是控制资源地址的，如果资源在cdn 那么 这里填 'www.cloud.com'
    assetsPublicPath: '/', //proxyTable代理也仅限 开发模式代理，部署到线上是没用的
    proxyTable: {  //proxyTable是一个代理插件，代理插件是方便转发的
      '/goods':{ //这里goods后面没有/匹配不懂  //因为http://localhost:3000已经跨域了 而axios是无法跨域的
          target:'http://127.0.0.1:3000'  //**代理就是当我们访问‘/goods’或者其他地址的时候会默认转发到'http://localhost:3000'
      },
      '/goods/*':{ //这里* 是通配符，就是所有/goods/后面的子页面都可以
        target:'http://127.0.0.1:3000'
      },
      '/users/*':{         
        target:'http://127.0.0.1:3000'  //这里http://127.0.0.1:3000的地址就是服务器，后台文件地址
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

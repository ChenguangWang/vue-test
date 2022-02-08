const webpack = require("webpack");
const path = require("path");
const resolve = dir => {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: "/portal",
  outputDir: "dist",
  transpileDependencies: ["vue-particles", "vue-echarts", "iview"],
  productionSourceMap: false,
  configureWebpack: {
    devtool: "source-map"
  },
  chainWebpack: config => {
    // 别名
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_c", resolve("src/components"));

    // 删除moment语音包
    config
      .plugin("ignore")
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      );

    // 防止多页面打包卡顿
    config => config.plugins.delete("named-chunks");

    if (process.env.use_analyzer) {
      // 分析
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }

    config.optimization.minimizer("terser").tap(args => {
      Object.assign(args[0].terserOptions.compress, {
        // 生产模式 console.log 去除
        pure_funcs: ["console.log"]
      });
      return args;
    });
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/styles/variable.less")]
    }
  },
  devServer: {
    port: 2021,
    proxy: {
      "/portal": {
        target: "http://172.23.7.208:8090",
        ws: false,
        changeOrigin: true
      }
    }
  }
};

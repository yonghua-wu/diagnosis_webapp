const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/edge": {
        target: "https://itproxy.seeingflow.com",
        changeOrigin: true,
        pathRewrite: {
          ["^/edge"]: "",
        },
      },
      "/api/video": {
        target: "https://itproxy.seeingflow.com",
        // target: "https://192.168.30.32:9088",
      },
      "/seeingflow-ticket": {
        target: "https://saas-gateway.530.seeingflow.com",
      },
      "/seeingflow-base": {
        target: "http://10.3.16.165:8080",
      },
      "/seeingflow-tenant": {
        target: "http://10.3.16.165:8080",
        // target: "http://192.168.30.29:8081",
      },
      "/seeingflow-tenant-server": {
        target: "http://192.168.30.39:8081",
      },
      "/seeingflow-wechat-app": {
        target: "http://10.3.16.165:8080",
        // target: "http://192.168.0.136:8081",
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.ENV !== "test" && process.env.ENV !== "dev" && process.env.ENV !== "development") {
      config.optimization.minimizer[0].options.minimizer.options.compress = Object.assign(
        config.optimization.minimizer[0].options.minimizer.options.compress,
        {
          drop_console: true,
        },
      );
    }
  },
});

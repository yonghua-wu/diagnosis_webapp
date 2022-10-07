const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/diagnosis": {
        target: "http://localhost:3000",
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

module.exports = {
  publicPath: "./",
  configureWebpack: {
    devtool: "source-map",
  },
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
    },
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
  },
};

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = process.env["NODE_ENV"] || "development";

const htmlPage = (name) =>
  new HtmlWebpackPlugin({
    page: name,
    chunks: [name],
    favicon: path.resolve(__dirname, "./static/favicon.ico"),
    template: path.resolve(__dirname, `./static/index.html`),
    filename: path.resolve(__dirname, `./build/${name}.html`),
  });

const config = {
  entry: {
    "00-sim": path.resolve(__dirname, "./apps/00-sim/index.tsx"),
  },
  mode: env,
  devtool: "source-map",
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: true,
              modules: true,
            },
          },
        ],
      },
      {
        rules: [
          {
            test: /\.hex/,
            type: "asset/source",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
  },
  plugins: [htmlPage("00-sim")],
  optimization: {
    moduleIds: "deterministic",
  },
};

if (process.env["NODE_ENV"] === "production") {
  delete config.devtool;
}

module.exports = config;

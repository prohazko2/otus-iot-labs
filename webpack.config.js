const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = process.env["NODE_ENV"] || "development";

const config = {
  entry: {
    app: path.resolve(__dirname, "app/index.tsx"),
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
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, "./static/favicon.ico"),
      template: path.resolve(__dirname, `./static/index.html`),
    }),
  ],
  optimization: {
    moduleIds: "deterministic",
  },
};

if (process.env["NODE_ENV"] === "production") {
  delete config.devtool;
}

module.exports = config;

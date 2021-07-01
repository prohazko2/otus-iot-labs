const path = require("path");
const glob = require("glob");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = process.env["NODE_ENV"] || "development";

const config = {
  entry: {
    /* populated with glob pattern bellow */
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
      {
        test: /\.html/,
        type: "asset/source",
        include: [path.resolve(__dirname, "apps")],
      },
      {
        test: /\.hex/,
        type: "asset/source",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  output: {
    path: path.resolve(__dirname, "./build"),
  },
  plugins: [],
  optimization: {
    moduleIds: "deterministic",
  },
};

if (process.env["NODE_ENV"] === "production") {
  delete config.devtool;
}

glob.sync("apps/*/index.{ts,tsx}").forEach((file) => {
  const full = path.resolve(__dirname, file);
  const name = path.basename(path.dirname(full));

  config.entry[name] = full;
  config.plugins.push(
    new HtmlWebpackPlugin({
      page: name,
      chunks: [name],
      favicon: path.resolve(__dirname, "./static/favicon.ico"),
      template: path.resolve(__dirname, `./static/index.html`),
      filename: path.resolve(__dirname, `./build/${name}.html`),
    })
  );
});

module.exports = config;

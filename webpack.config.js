const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  return {
    entry: "./src/index.tsx",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "index.js",
    },
    devtool: false,
    externals: {
      uxp: "commonjs2 uxp",
      photoshop: "commonjs2 photoshop",
      os: "commonjs2 os",
    },
    module: {
      rules: [
        // {
        //   test: /\.ts(x?)$/,
        //   enforce: "pre",
        //   exclude: /node_modules/,
        //   use: "tslint-loader",
        // },

        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "ts-loader",
        },
        // {
        //   test: /\.png$/,
        //   exclude: /node_modules/,
        //   loader: "file-loader",
        // },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      // new HtmlWebpackPlugin({
      //   template: "./src/index.html",
      // }),
      new CopyPlugin({
        patterns: ["plugin"],
      }),
    ],
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};

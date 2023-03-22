const path = require("path");

module.exports = {
  entry: path.join(__dirname, "frontend", "js", "app.js"),
  mode: "development",
  devtool: false,
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public", "bundle"),
  },
};

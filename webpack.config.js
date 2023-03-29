const path = require("path");

module.exports = {
  entry: path.join(__dirname, "scenes", "app.js"),
  mode: "development",
  devtool: false,
  output: {
    filename: "app.js",
    path: path.join(__dirname, "public", "bundle"),
  },
};

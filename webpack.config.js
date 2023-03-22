const path = require("path");

module.exports = {
  entry: "./src/js/app.js",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/bundle"),
  },
};

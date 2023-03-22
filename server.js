const express = require("express");
const webpack = require("webpack");
const config = require("./webpack.config.js");

const compiler = webpack(config);

const server = express();

compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {
    // Print watch/build result here...
  }
);

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

server.use(express.static("public"));

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

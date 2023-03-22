const express = require("express");
const webpack = require("webpack");
const config = require("./webpack.config.js");

const compiler = webpack(config);

const server = express();

server.use(express.static("public"));

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {}
);

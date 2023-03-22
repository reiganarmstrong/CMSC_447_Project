const path = require("path");
const express = require("express");
const webpack = require("webpack");
const config = require(path.join(__dirname, "..", "webpack.config.js"));

const compiler = webpack(config);

const server = express();

// middleware
server.use(express.static(path.join(__dirname, "..", "public")));
server.use(express.json());

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {}
);

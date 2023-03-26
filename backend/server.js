const path = require("path");
const express = require("express");
const webpack = require("webpack");
const config = require(path.join(__dirname, "..", "webpack.config.js"));

const compiler = webpack(config);

const server = express();

// middleware
server.use(express.static(path.join(__dirname, "..", "public")));
server.use(express.json());

// start server on port 3000
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// get webpage
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// rebundle js files wih webpack on nodemon refresh
compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {}
);

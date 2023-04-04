const path = require("path");
const express = require("express");
const webpack = require("webpack");
const handleLogin = require("./apiHelpers/handleLogin");
const getDb = require("./apiHelpers/connectToDatabase");
const config = require(path.join(__dirname, "..", "webpack.config.js"));
const compiler = webpack(config);
let port = 3000;

const server = express();

// middleware
server.use(express.static(path.join(__dirname, "..", "public")));
console.log(path.join(__dirname, "..", "public"));
// server.use(express.json());

// start server on port 3000
server.listen(port, () => {
  console.log("Server is running on port 3000");
});

// get webpage
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "html", "index.html"));
});

// login
server.get("/login", async (req, res) => {
  const db = getDb();
  const player = await handleLogin(db, req.query.name);
  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database Closed!");
    }
  });
  res.json(player);
});

// rebundle js files wih webpack on nodemon refresh
compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {}
);

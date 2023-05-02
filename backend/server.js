const path = require("path");
const express = require("express");
const webpack = require("webpack");
const handleLogin = require("./apiHelpers/handleLogin");
const getDb = require("./apiHelpers/connectToDatabase");
const config = require(path.join(__dirname, "..", "webpack.config.js"));
const compiler = webpack(config);
const axios = require("axios");
const getHighScores = require("./apiHelpers/getHighScores");

const port = 3000;

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

// gets the global high scores
server.get("/high_scores/global", async (req, res) => {
  const db = getDb();
  const scores = await getHighScores(db);
  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database Closed!");
    }
  });
  res.statusCode = 200;
  res.statusMessage = "OK";

  res.json(scores);
});

// gets the glocal high scores, and sends them to the uri if there are 5, if not responds with a 404
server.post("/high_scores/global", async (req, res) => {
  const db = getDb();
  const scores = await getHighScores(db);
  const data = {
    data: [
      {
        Group: "D",
        Title: "Top 5 Scores",
        ...scores,
      },
    ],
  };
  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database Closed!");
    }
  });

  if (Object.keys(data["data"][0]).length == 7) {
    // post the global high scores
    const response = await axios.post(
      "https://eope3o6d7z7e2cc.m.pipedream.net",
      data
    );
    res.statusCode = response["status"];
    res.statusMessage = response["statusText"];
    res.json(scores);
  } else {
    res.statusCode = 404;
    res.statusMessage = "5 High Scores Not Present";
    res.send();
  }
});
// rebundle js files wih webpack on nodemon refresh
compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {}
);

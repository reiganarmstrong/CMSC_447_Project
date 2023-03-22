const express = require("express");
const server = express();

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

server.use(express.static("public"));

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

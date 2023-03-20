const express = require("express");
const galiga = express();

galiga.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

galiga.listen(3000, () => {
  console.log("Server is running on port 3000");
});

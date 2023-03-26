const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const getDb = () => {
  // connect to the database
  return new sqlite3.Database(
    path.join("..", "players.db"),
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the players database.");
    }
  );
};

module.exports = getDb;

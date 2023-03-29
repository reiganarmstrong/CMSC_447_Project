const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const createDb = () => {
  // connect to the database
  return new sqlite3.Database(
    path.join(__dirname, "..", "players.db"),
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message + "sds");
      }
      console.log("Connected to the players database.");
    }
  );
};

module.exports = createDb;

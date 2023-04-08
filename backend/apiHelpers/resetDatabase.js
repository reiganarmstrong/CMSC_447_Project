const db = require("./connectToDatabase")();
const resetDatabase = (db) => {
  // sql statements
  const createTable =
    "CREATE TABLE players(name TEXT NOT NULL PRIMARY KEY, level INTEGER, highScore1 TEXT, highScore2 TEXT, highScore3 TEXT)";
  const dropTable = "DROP TABLE IF EXISTS players";
  db.serialize(() => {
    // drops players table if it already exist
    db.run(dropTable, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    // creates a new table if it doesn't already exist
    db.run(createTable, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  });
};

const run = () => {
  resetDatabase(db);

  db.close((err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("Players database closed");
  });
};

run();

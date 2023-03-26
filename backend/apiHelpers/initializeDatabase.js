const db = require("./connectToDatabase")();

module.exports = () => {
  // sql statements
  const createTable =
    "CREATE TABLE players(name TEXT NOT NULL PRIMARY KEY, level INTEGER)";
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
  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Closed players database.");
    }
  });
};

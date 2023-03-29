const initializeDatabase = require("./initializeDatabase");
const handleLogin = require("./handleLogin");
const getPlayer = require("./getPlayer");
const db = require("./connectToDatabase")();

const test = async () => {
  initializeDatabase(db);
  console.log(await handleLogin(db, "paco"));

  db.close((err) => {
    if (err) {
      console.log(err.message);
    }
    console.log("Players database closed");
  });
};

test();

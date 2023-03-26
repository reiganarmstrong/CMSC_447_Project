const db = require("./connectToDatabase")();
const createPlayer = require("./createPlayer");
const getPlayer = require("./getPlayer");

module.exports = async (name) => {
  let returnStatement = "FAILED";
  let players = null;
  name = name.trim();

  players = await getPlayer(db, name);
  if (players == null) {
    console.log("FAILED AT GETTING PLAYER OPERATION");
    // if there is a player with this name
  } else if (players.length > 0) {
    returnStatement = players[0].level;
    // if not create a new player
  } else {
    await createPlayer(db, name);
    returnStatement = 1;
  }
  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Closed players database");
    }
  });
  return returnStatement;
};

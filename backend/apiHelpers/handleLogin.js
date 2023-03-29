const createPlayer = require("./createPlayer");
const getPlayer = require("./getPlayer");

module.exports = async (db, name) => {
  let returnStatement = { name: "null" };
  let players = null;
  name = name.trim();

  players = await getPlayer(db, name);
  if (players == null) {
    console.log("FAILED AT GETTING PLAYER OPERATION");
    // if there is a player with this name
  } else if (players.length > 0) {
    returnStatement = players[0];
    // if not create a new player
  } else {
    await createPlayer(db, name);
    returnStatement = (await getPlayer(db, name))[0];
  }
  return returnStatement;
};

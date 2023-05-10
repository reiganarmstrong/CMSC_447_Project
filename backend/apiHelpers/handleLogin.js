const createPlayer = require("./createPlayer");
const getPlayer = require("./getPlayer");
const axios = require("axios");
const POST_URL = "http://localhost:3000/high_scores/global";
let numPlayers = 0;
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
    numPlayers++;
    await createPlayer(db, name);
    if (numPlayers == 5) {
      await axios.post(POST_URL);
    }
    returnStatement = (await getPlayer(db, name))[0];
  }
  return returnStatement;
};

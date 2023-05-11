const getPlayer = require("./getPlayer");
module.exports = (db, name, level) => {
  const updatePlayerLevel = `UPDATE players SET level = ? WHERE name = ?`;
  // initialize new player with their given name and starting unlocked level 1
  return new Promise((resolve, reject) => {
    // set level to level 3 for development
    db.run(updatePlayerLevel, [level, name.trim()], (err) => {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      console.log(`Success! updated player ${name} score`);
      resolve(getPlayer(db, name));
    });
  });
};

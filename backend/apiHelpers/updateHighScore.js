const getPlayer = require("./getPlayer");

const levelFields = [
  "highScore1",
  "highScore2",
  "highScore3",
  "totalHighScore",
];
// name and level
module.exports = (db, name, level, score, prevScore, prevTotalScore) => {
  const updatePlayerScore = `UPDATE players SET ${
    levelFields[level - 1]
  } = ?, totalHighScore = ? WHERE name = ?`;
  // initialize new player with their given name and starting unlocked level 1
  return new Promise((resolve, reject) => {
    // set level to level 3 for development
    db.run(
      updatePlayerScore,
      [score, prevTotalScore + (score - prevScore), name.trim()],
      (err) => {
        if (err) {
          console.log(err.message);
          reject(err.message);
        }
        console.log(`Success! updated player ${name} score`);
        resolve(getPlayer(db, name));
      }
    );
  });
};

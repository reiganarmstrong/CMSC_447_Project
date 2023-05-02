const { resolve } = require("path");
const searchUser = "SELECT * FROM players ORDER BY totalHighScore ASC";

module.exports = (db) => {
  return new Promise((resolve, reject) => {
    db.all(searchUser, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let high_scores = {};
        for (let i = 0; i < rows.length && i < 5; i++) {
          high_scores[rows[i]["name"]] = rows[i]["totalHighScore"];
        }
        resolve(high_scores);
      }
    });
  });
};

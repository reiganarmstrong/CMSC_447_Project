const searchUser = "SELECT * FROM players WHERE name = ?";

module.exports = (db, name) => {
  return new Promise((resolve, reject) => {
    db.all(searchUser, [name], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

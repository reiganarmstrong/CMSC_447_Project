createPlayer = `INSERT INTO players VALUES (?,?,?,?,?,?)`;
// name and level
module.exports = (db, name) => {
  // initialize new player with their given name and starting unlocked level 1
  return new Promise((resolve, reject) => {
    // set level to level 3 for development
    db.run(createPlayer, [name.trim(), 3, 0, 0, 0, 0], (err) => {
      if (err) {
        console.log(err.message);
        reject(err.message);
      }
      resolve(`Success! Created player ${name}`);
    });
  });
};

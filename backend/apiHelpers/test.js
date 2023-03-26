const handleLogin = require("./handleLogin");
const initializeDatabase = require("./initializeDatabase");

const test = async () => {
  initializeDatabase();
  console.log(await handleLogin("paco"));
};

test();

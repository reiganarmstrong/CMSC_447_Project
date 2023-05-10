import Phaser from "phaser";
import loginScene from "./loginScene";
import levelTwoScene from "./levelTwoScene";

import mainMenuScene from "./mainMenuScene";
import levelSelectorScene from "./levelSelectorScene";
import pauseMenuScene from "./pauseMenuScene";
import highScoresScene from "./highScoresScene";

import deathMenuScene from "./deathMenuScene";
import levelOneScene from "./levelOneScene";
import clearMenuScene from "./clearLevelScene";
import localHighScoresScene from "./localHighScoresScene";
import globalHighScoresScene from "./globalHighScoresScene";
import levelThreeScene from "./levelThreeScene";

const width = 1024;
const height = 768;
//const width = 1024;
//const height = 1.5*768;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  parent: "app-container",
  scene: [
    loginScene,
    mainMenuScene,
    levelSelectorScene,
    highScoresScene,
    pauseMenuScene,
    levelOneScene,
    levelTwoScene,
    levelThreeScene,
    deathMenuScene,
    clearMenuScene,
    localHighScoresScene,
    globalHighScoresScene,
  ],
};

const game = new Phaser.Game(config);
console.log(game);
export { width, height };

import Phaser from "phaser";
import loginScene from "./loginScene";
import mainMenuScene from "./mainMenuScene";
import levelSelectorScene from "./levelSelectorScene";
import pauseMenuScene from "./pauseMenuScene";
import highScoresScene from "./highScoresScene";
import testScene2 from "./testScene2";
import testScene1 from "./testScene1";
import testScene3 from "./testScene3";
import deathMenuScene from "./deathMenuScene";

const width = 1024;
const height = 768;
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
    testScene1,
    mainMenuScene,
    levelSelectorScene,
    highScoresScene,
    pauseMenuScene,
    testScene2,
    testScene3,
    deathMenuScene,
  ],
};

const game = new Phaser.Game(config);
console.log(game);
export { width, height };

import Phaser from "phaser";
import loginScene from "./loginScene";
import testScene from "./testScene";
import mainMenuScene from "./mainMenuScene";
import levelSelectorScene from "./levelSelectorScene";
import pauseMenuScene from "./pauseMenuScene";
import highScoresScene from "./highScoresScene";

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
    testScene,
    mainMenuScene,
    levelSelectorScene,
    highScoresScene,
    pauseMenuScene,
  ],
};

const game = new Phaser.Game(config);
console.log(game);
export { width, height };

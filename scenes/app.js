import Phaser from "phaser";
import loginScene from "./loginScene";
import testScene from "./testScene";

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
  scene: [testScene],
};

const game = new Phaser.Game(config);
console.log(game);
export { width, height };

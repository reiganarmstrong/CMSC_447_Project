import Phaser from "phaser";
import loginScene from "./loginScene";

const width = 1024;
const height = 768;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  dom: {
    createContainer: true,
  },
  parent: "app-container",
  scene: [loginScene],
};

const game = new Phaser.Game(config);
console.log(game);
export { width, height };

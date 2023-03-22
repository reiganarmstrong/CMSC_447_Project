import Phaser from "phaser";

const preload = () => {};

const create = () => {};

const update = () => {};

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app-container",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
console.log(game);

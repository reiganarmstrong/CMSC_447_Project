import Phaser from "phaser";

const preload = () => {};

const create = () => {};

const update = () => {};

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "app-container",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
console.log(game);

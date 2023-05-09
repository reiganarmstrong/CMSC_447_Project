import { Scene } from "phaser";
import { width, height } from "./app";

class deathMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "deathMenuScene" });
  }
  init(data) {
    this.userData = data.userData;
    this.levelKey = data.sceneKey;
  }
  preload() {
    this.load.html("deathMenu", "/html/deathMenu.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("deathMenu");
    const restart = menu.getChildByID("restart");
    const mainMenu = menu.getChildByID("main-menu");
    menu.parent.classList.add("centered-container");
    mainMenu.addEventListener("click", () => {
      this.scene.stop(this.levelKey);
      this.scene.start("mainMenuScene", this.userData);
    });
    restart.addEventListener("click", () => {
      this.restartLevel();
    });
  }

  restartLevel() {
    this.scene.stop(this.levelKey);
    this.scene.start(this.levelKey);
  }
}

export default deathMenuScene;

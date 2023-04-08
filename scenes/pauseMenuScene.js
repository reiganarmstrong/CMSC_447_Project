import { Scene } from "phaser";
import { width, height } from "./app";

class pauseMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "pauseMenuScene" });
  }
  init(data) {
    this.userData = data.userData;
    console.log(data);
    this.levelKey = data.sceneKey;
  }
  preload() {
    this.load.html("pauseMenu", "/html/pauseMenu.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("pauseMenu");
    const resume = menu.getChildByID("resume");
    const restart = menu.getChildByID("restart");
    const mainMenu = menu.getChildByID("main-menu");
    const userName = menu.getChildByID("user");
    this.keys = this.input.keyboard.addKeys("ESC");
    userName.textContent = this.userData.name;
    menu.parent.classList.add("centered-container");
    mainMenu.addEventListener("click", () => {
      this.scene.stop(this.levelKey);
      this.scene.start("mainMenuScene", this.userData);
    });
    resume.addEventListener("click", () => {
      this.returnToLevel();
    });
    restart.addEventListener("click", () => {
      this.restartLevel();
    });
  }
  update(time, delta) {
    if (this.keys.ESC.isDown) {
      this.returnToLevel();
    }
  }
  returnToLevel() {
    this.scene.resume(this.levelKey);
    this.scene.stop();
  }
  restartLevel() {
    this.scene.stop(this.levelKey);
    this.scene.start(this.levelKey);
  }
}

export default pauseMenuScene;

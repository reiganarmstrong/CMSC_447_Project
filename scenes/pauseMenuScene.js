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
    const mainMenu = menu.getChildByID("main-menu");
    const userName = menu.getChildByID("user");
    userName.textContent = this.userData.name;
    menu.parent.classList.add("centered-container");
    mainMenu.addEventListener("click", () => {
      this.scene.start("mainMenuScene", this.userData);
    });
    resume.addEventListener("click", () => {
      this.scene.resume(this.levelKey);
      this.scene.stop();
    });
  }
  update(time, delta) {}
}

export default pauseMenuScene;

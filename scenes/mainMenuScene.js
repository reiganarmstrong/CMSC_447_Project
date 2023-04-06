import { Scene } from "phaser";
import { width, height } from "./app";

class mainMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "mainMenuScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("mainMenu", "/html/mainMenu.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("mainMenu");
    const levelSelector = menu.getChildByID("level-selector");
    const highScores = menu.getChildByID("high-scores");
    const logOut = menu.getChildByID("log-out");
    const userInfo = menu.getChildByID("user");
    console.log(this.userData.name);
    userInfo.textContent = this.userData.name;
    menu.parent.classList.add("centered-container");
    highScores.addEventListener("click", () => {
      console.log("High Scores Selected");
    });
    levelSelector.addEventListener("click", () => {
      this.scene.start("levelSelectorScene", this.userData);
    });
    logOut.addEventListener("click", () => {
      this.scene.start("loginScene");
    });
  }
  update(time, delta) {}
}

export default mainMenuScene;

import { Scene } from "phaser";
import { width, height } from "./app";

const LEVEL_IDS = ["levelOneScene", "levelTwoScene"];

class clearMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "clearMenuScene" });
  }
  init(data) {
    this.userData = data.userData;
    this.levelKey = data.sceneKey;
    this.level = LEVEL_IDS.indexOf(this.levelKey) + 1;
    this.killCount = data.killCount;
    this.lifeCount = data.lifeCount;
  }
  preload() {
    this.load.html("clearMenu", "/html/clearMenu.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("clearMenu");
    const title = menu.getChildByID("success-title");
    const killCount = menu.getChildByID("kill-count");
    const lifeCount = menu.getChildByID("life-count");
    const finalScore = menu.getChildByID("final-score");
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
    title.textContent = `CLEARED LEVEL ${this.level}`;
    killCount.textContent = `KILL COUNT: ${this.killCount}`;
    lifeCount.textContent = `LIVES LEFT: ${this.lifeCount}`;
    finalScore.textContent = `FINAL SCORE: ${this.killCount + 5 * lifeCount}`;
  }

  restartLevel() {
    this.scene.stop(this.levelKey);
    this.scene.start(this.levelKey);
  }
}

export default clearMenuScene;

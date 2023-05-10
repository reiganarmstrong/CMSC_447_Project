import { Scene } from "phaser";
import { width, height } from "./app";

class highScoresScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "highScoresScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("highScores", "/html/highScores.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("highScores");
    const level1 = menu.getChildByID("level-1");
    const level2 = menu.getChildByID("level-2");
    const level3 = menu.getChildByID("level-3");
    const total = menu.getChildByID("total");
    const back = menu.getChildByID("back");
    const userName = menu.getChildByID("user");
    userName.innerHTML = `${this.userData.name}'s High Scores`;
    menu.parent.classList.add("centered-container");
    level1.textContent = `Level 1: ${this.userData.highScore1}`;
    level2.textContent = `Level 2: ${this.userData.highScore2}`;
    level3.textContent = `Level 3: ${this.userData.highScore3}`;
    total.textContent = `Total Score: ${this.userData.totalHighScore}`;
    back.addEventListener("click", () => {
      this.scene.start("mainMenuScene");
    });
  }
  update(time, delta) {}
}

export default highScoresScene;

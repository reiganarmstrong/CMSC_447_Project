import { Scene } from "phaser";
import { width, height } from "./app";
import axios from "axios";
const LEVEL_IDS = ["levelOneScene", "levelTwoScene"];
const PUT_URL = "http://localhost:3000/high_scores/local";
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
    this.score = (this.killCount + 2 * this.lifeCount) * this.level;
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
    console.log(title);
    const killCount = menu.getChildByID("kill-count");
    const lifeCount = menu.getChildByID("life-count");
    const finalScore = menu.getChildByID("final-score");
    const restart = menu.getChildByID("restart");
    const mainMenu = menu.getChildByID("main-menu");
    menu.parent.classList.add("centered-container");
    title.textContent = `CLEARED LEVEL ${this.level}`;
    killCount.textContent = `KILL COUNT: ${this.killCount}`;
    lifeCount.textContent = `LIVES LEFT: ${this.lifeCount}`;
    finalScore.textContent = `FINAL SCORE: ${this.score}`;
    this.updateHighScores(finalScore).then(() => {
      mainMenu.addEventListener("click", () => {
        this.scene.stop(this.levelKey);
        this.scene.start("mainMenuScene", this.userData);
      });
      restart.addEventListener("click", () => {
        this.restartLevel();
      });
    });
  }

  async updateHighScores(finalScoreText) {
    const body = {
      name: this.userData.name,
      level: this.level,
      score: this.score,
    };
    try {
      const res = await axios.put(PUT_URL, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.userData = res.data[0];
      finalScore.textContent += " (HIGH SCORE !!!)";
    } catch (err) {
      this.userData = err.response.data;
    }
    console.log(this.userData);
  }

  restartLevel() {
    this.scene.stop(this.levelKey);
    this.scene.start(this.levelKey, this.userData);
  }
}

export default clearMenuScene;

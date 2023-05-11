import { Scene } from "phaser";
import { width, height } from "./app";
import axios from "axios";
const LEVEL_IDS = [
  "levelOneScene",
  "levelTwoScene",
  "levelThreeScene",
  "bossScene",
];
const PUT_URL = "http://localhost:3000/high_scores/local";
const GET_POST_URL = "http://localhost:3000/high_scores/global";
class clearMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "clearMenuScene" });
  }
  init(data) {
    this.userData = data.userData;
    this.levelKey = data.sceneKey;
    this.level = LEVEL_IDS.indexOf(this.levelKey) + 1;
    this.lifeCount = data.lifeCount;
    if (this.level != 4) {
      this.killCount = data.killCount;
      this.score = (this.killCount + 2 * this.lifeCount) * this.level;
    } else {
      this.killCount = 1;
      this.score = 500;
    }
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
    if (this.level != 4) {
      title.textContent = `CLEARED LEVEL ${this.level}`;
    } else {
      title.textContent = `CLEARED BOSS LEVEL`;
    }
    killCount.textContent = `KILL COUNT: ${this.killCount}`;
    lifeCount.textContent = `LIVES LEFT: ${this.lifeCount}`;
    finalScore.textContent = `FINAL SCORE: ${this.score}`;
    if (this.level == 4) {
      finalScore.textContent += " (MAX)";
    }
    this.updateHighScores(title)
      .then(() => {
        this.incrementPlayerLevel();
      })
      .then(() => {
        mainMenu.addEventListener("click", () => {
          this.scene.stop(this.levelKey);
          this.scene.start("mainMenuScene", this.userData);
        });
        restart.addEventListener("click", () => {
          this.restartLevel();
        });
      });
  }

  async updateHighScores(title) {
    const initialGlobalHighScores = (await axios.get(GET_POST_URL)).data;
    try {
      const body = {
        name: this.userData.name,
        level: this.level,
        score: this.score,
      };
      const res = await axios.put(PUT_URL, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.userData = res.data[0];
      if (this.level != 4) {
        title.textContent += " (NEW HIGH SCORE!)";
      }
      const postGlobalHighScores = (await axios.get(GET_POST_URL)).data;
      if (
        JSON.stringify(initialGlobalHighScores) !=
          JSON.stringify(postGlobalHighScores) &&
        Object.keys(postGlobalHighScores).length >= 5
      ) {
        await axios.post(GET_POST_URL);
      }
    } catch (err) {
      this.userData = err.response.data;
    }
    console.log(this.userData);
  }
  async incrementPlayerLevel() {
    try {
      const body = {
        name: this.userData.name,
        level: this.userData.level + 1,
      };
      const res = await axios.put("/player/level", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.userData = res.data[0];
    } catch (err) {
      this.userData = err.response.data;
    }
  }

  restartLevel() {
    this.scene.stop(this.levelKey);
    this.scene.start(this.levelKey, this.userData);
  }
}

export default clearMenuScene;

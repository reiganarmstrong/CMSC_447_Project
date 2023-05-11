import { Scene } from "phaser";
import { width, height } from "./app";
import axios from "axios";
class localHighScoresScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "localHighScoresScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("localHighScores", "/html/localHighScores.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("localHighScores");
    const level1 = menu.getChildByID("level-1");
    const level2 = menu.getChildByID("level-2");
    const level3 = menu.getChildByID("level-3");
    const boss = menu.getChildByID("boss");
    const total = menu.getChildByID("total");
    const back = menu.getChildByID("back");
    const userName = menu.getChildByID("user");
    menu.parent.classList.add("centered-container");
    this.updateUserData().then(() => {
      userName.innerHTML = `${this.userData.name}'s High Scores`;
      level1.textContent = `Level 1: ${this.userData.highScore1}`;
      level2.textContent = `Level 2: ${this.userData.highScore2}`;
      level3.textContent = `Level 3: ${this.userData.highScore3}`;
      if (this.userData.bossCleared > 0) {
        boss.textContent = `Boss Level: ${this.userData.bossCleared} (MAX)`;
      } else {
        boss.textContent = `Boss Level: ${this.userData.bossCleared}`;
      }
      total.textContent = `Total Score: ${this.userData.totalHighScore}`;
      back.addEventListener("click", () => {
        this.scene.start("highScoresScene", this.userData);
      });
    });
  }
  async updateUserData() {
    this.userData = (
      await axios.get("/login", {
        params: {
          name: this.userData.name,
        },
      })
    ).data;
  }
  update(time, delta) {}
}

export default localHighScoresScene;

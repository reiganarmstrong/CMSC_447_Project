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
    const selector = this.add
      .dom(width / 2, height / 2)
      .createFromCache("highScores");
    const user = selector.getChildByID("user");
    const yourScores = selector.getChildByID("your-scores");
    const globalScores = selector.getChildByID("global-scores");
    const back = selector.getChildByID("back");
    user.textContent = this.userData.name;
    selector.parent.classList.add("centered-container");

    back.addEventListener("click", () => {
      this.scene.start("mainMenuScene", this.userData);
    });
    yourScores.addEventListener("click", () => {
      this.scene.start("localHighScoresScene", this.userData);
    });
    globalScores.addEventListener("click", () => {
      this.scene.start("globalHighScoresScene", this.userData);
    });
  }
  update(time, delta) {}
}

export default highScoresScene;

import { Scene } from "phaser";
import { width, height } from "./app";
import axios from "axios";

const IDS = ["first", "second", "third", "fourth", "fifth"];
class globalHighScoresScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "globalHighScoresScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("globalHighScores", "/html/globalHighScores.html");
  }
  create() {
    // adds the menu
    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("globalHighScores");
    menu.parent.classList.add("centered-container");
    axios.get("/high_scores/global").then((res) => {
      const title = menu.getChildByID("global-scores-title");
      const data = res.data;
      let entries = Object.entries(data);
      title.textContent = "Global High Scores";
      entries.sort((a, b) => b[1] - a[1]);
      for (let i = 0; i < entries.length; i++) {
        const temp = menu.getChildByID(IDS[i]);
        temp.textContent = `${entries[i][0]}: ${entries[i][1]}`;
      }
    });

    back.addEventListener("click", () => {
      this.scene.start("highScoresScene", this.userData);
    });
  }

  update(time, delta) {}
}

export default globalHighScoresScene;

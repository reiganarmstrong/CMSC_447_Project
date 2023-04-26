import { Scene } from "phaser";
import { width, height } from "./app";

class levelSelectorScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "levelSelectorScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("levelSelector", "/html/levelSelector.html");
  }
  create() {
    // adds the menu
    const selector = this.add
      .dom(width / 2, height / 2)
      .createFromCache("levelSelector");
    const user = selector.getChildByID("user");
    const level1 = selector.getChildByID("level-1");
    const level2 = selector.getChildByID("level-2");
    const level3 = selector.getChildByID("level-3");
    const levels = [level1, level2, level3];
    const back = selector.getChildByID("back");
    user.textContent = this.userData.name;
    selector.parent.classList.add("centered-container");

    for (let i = 0; i < levels.length; i++) {
      let unlocked = i + 1 <= this.userData["level"];
      levels[i].addEventListener("click", () => {
        console.log(`Level ${i + 1} Selected`);
        if (unlocked) {
          if (i == 0) {
            this.scene.start("testScene1", this.userData);
          } else if (i == 1) {
            this.scene.start("testScene1", this.userData);
          } else if (i == 2) {
            this.scene.start("testScene2", this.userData);
          }
        }
      });
      if (!unlocked) {
        levels[i].classList.add("set-invisible");
      }
    }

    back.addEventListener("click", () => {
      this.scene.start("mainMenuScene", this.userData);
    });
  }
  update(time, delta) {}
}

export default levelSelectorScene;

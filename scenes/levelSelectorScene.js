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
    const back = selector.getChildByID("back");
    user.textContent = this.userData.name;
    selector.parent.classList.add("centered-container");
    level1.addEventListener("click", () => {
      console.log("Level 1 Selected");
      this.scene.start("testScene1", this.userData);
    });
    level2.addEventListener("click", () => {
      console.log("Level 2 Selected");
      this.scene.start("testScene2", this.userData);
    });
    level3.addEventListener("click", () => {
      console.log("Level 3 Selected");
      this.scene.start("testScene", this.userData);
    });
    back.addEventListener("click", () => {
      this.scene.start("mainMenuScene", this.userData);
    });
  }
  update(time, delta) {}
}

export default levelSelectorScene;

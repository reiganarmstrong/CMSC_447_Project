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
    const colors = [0x051923, 0x13284a];
    //holds the width and the height of the game screen
    const width = this.game.config.width;
    const height = this.game.config.height;
    // Create a new Graphics object and draw the gradient
    this.add.graphics()
    .fillGradientStyle(...colors, 1, 0.5, 0.5, 1, false)
    .fillRect(0, 0, width, height);
      //makes sure it covers the whole screen
    // Define an array of colors for the stars
    const starColors = [0xffffff, 0xffd700, 0xff69b4, 0x00ff00, 0x00ffff];
    //Background Stars
    for (let i = 0; i < 100; i++) {
        //Phaser.Math.Between picks a random val between min and max
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        const size = Phaser.Math.Between(1, 3);
        //picks random value from arr
        const star = Phaser.Math.RND.pick(starColors);
        this.add.graphics()
            .fillStyle(star, 1)
            .fillCircle(x, y, size);
    }
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

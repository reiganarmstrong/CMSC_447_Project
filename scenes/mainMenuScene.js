import { Scene } from "phaser";
import { width, height } from "./app";

class mainMenuScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "mainMenuScene" });
  }
  init(userData) {
    this.userData = userData;
  }
  preload() {
    this.load.html("mainMenu", "/html/mainMenu.html");
  }
  create() {
    // adds the menu
    const colors = [0x051923, 0x13284a];
    //holds the width and the height of the game screen
    const width = this.game.config.width;
    const height = this.game.config.height;
    // Create a new Graphics object and draw the gradient
    this.add
      .graphics()
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
      this.add.graphics().fillStyle(star, 1).fillCircle(x, y, size);
    }

    const menu = this.add
      .dom(width / 2, height / 2)
      .createFromCache("mainMenu");
    const levelSelector = menu.getChildByID("level-selector");
    const highScores = menu.getChildByID("high-scores");
    const logOut = menu.getChildByID("log-out");
    const userName = menu.getChildByID("user");
    userName.textContent = this.userData.name;
    menu.parent.classList.add("centered-container");
    highScores.addEventListener("click", () => {
      this.scene.start("highScoresScene", this.userData);
    });
    levelSelector.addEventListener("click", () => {
      this.scene.start("levelSelectorScene", this.userData);
    });
    logOut.addEventListener("click", () => {
      this.scene.start("loginScene");
    });
  }
  update(time, delta) {}
}

export default mainMenuScene;

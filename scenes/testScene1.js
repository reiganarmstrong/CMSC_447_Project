import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
class testScene1 extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "testScene1" });
  }

  init(userData) {
    this.userData = userData;
  }

  preload() {
    // must load from webserver (even if localhost) instead of from a local file
    // due to security reasons
    this.load.image("ship", "assets/png/ship.png");
    this.load.image("ship_left", "assets/png/ship_left.png");
    this.load.image("ship_right", "assets/png/ship_right.png");
    this.load.image("missile", "assets/png/missile.png");
    this.load.image("sky", "assets/png/sky.png");
    this.load.image("space", "assets/png/space.png");
    this.load.image("space2", "assets/png/space2.png");
    this.load.image("space3", "assets/png/space3.png");
    this.load.audio("start_sound", "assets/audio/start_sound.mp3");
    this.load.audio("level_sound", "assets/audio/level_music.mp3");
  }

  create() {
    //this.add.image(512, 384, "space3");
    const colors = [0x051923, 0x13284a, 0x1e3b6d, 0x1f4f9c, 0x1788ac, 0x2cc1c3, 0x81d5d7];
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
    const strtS = this.sound.add("start_sound");
    const lvlS = this.sound.add("level_sound");
    strtS.play();
    strtS.on('complete', function() {
      lvlS.play();
      lvlS.setVolume(0.5);
      lvlS.setLoop(true);
    }.bind(this));

      
    this.laserGroup = new LaserGroup(this);
    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    //this.ship.setCollideWorldBounds(true);
    this.debugText = this.add.text(16, 16, "hello");
  }

  update() {
    console.log(this.ship);
    this.physics.world.wrap(this.ship);

    this.debugText.setText(
      "fps: " +
        this.game.loop.actualFps.toString() +
        "\n" +
        "y: " +
        this.ship.y +
        "\n" +
        "y velocity: " +
        this.ship.body.velocity.y.toString() +
        "\n" +
        "x velocity: " +
        this.ship.body.velocity.x.toString() +
        "\n"
    );
    if (this.ship.y >= 734 && this.ship.body.velocity.y > 0) {
      this.ship.body.velocity.y = 0;
    }
    if (this.keys.UP.isDown) {
      console.log("up");
      //this.ship.setVelocityY(this.ship.body.velocity.y - 4);
      this.ship.setVelocityY(500 - this.ship.y);
    }
    if (this.keys.DOWN.isDown) {
      console.log("down");
      /*if (this.ship.y < 734) {
        this.ship.setVelocityY(this.ship.body.velocity.y + 4);
      }*/
      this.ship.setVelocityY(734 - this.ship.y);
    }
    if (this.keys.LEFT.isDown && !this.keys.RIGHT.isDown) {
      console.log("left");
      if (this.ship.body.velocity.x > 400) {
        this.ship.setTexture("ship");
      } else {
        this.ship.setTexture("ship_left");
      }
      this.ship.setVelocityX(this.ship.body.velocity.x - 10);
    }
    if (this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
      console.log("right");
      if (this.ship.body.velocity.x < -400) {
        this.ship.setTexture("ship");
      } else {
        this.ship.setTexture("ship_right");
      }
      this.ship.setVelocityX(this.ship.body.velocity.x + 10);
    }
    if (!this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
      this.ship.setTexture("ship");
      this.ship.setVelocityX(this.ship.body.velocity.x * 0.98);
    }
    if (!this.keys.UP.isDown && !this.keys.DOWN.isDown) {
      this.ship.setVelocityY(this.ship.body.velocity.y * 0.98);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      console.log("shooted");
      this.laserGroup.fireLaser(
        this.ship.x + this.ship.body.velocity.x * 0.03,
        this.ship.y - 48,
        this.ship.body.velocity.x,
        this.ship.body.velocity.y
      );
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      console.log("Esc");
      this.scene.launch("pauseMenuScene", {
        userData: this.userData,
        sceneKey: "testScene1",
      });

      this.scene.pause();
    }
  }
}

export default testScene1;
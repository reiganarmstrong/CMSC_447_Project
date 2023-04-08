import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
import EnemyGroup from "./helperClasses/EnemyGroup";
class testScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "testScene" });
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
    this.load.image("enemy1", "assets/png/enemy1.png");
    this.load.image("sky", "assets/png/sky.png");
  }

  create() {
    this.add.image(512, 384, "sky");
    this.laserGroup = new LaserGroup(this);
    this.enemyGroup = new EnemyGroup(this);

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;
    this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    //this.ship.setCollideWorldBounds(true);

    this.debugText = this.add.text(16, 16, "hello");


    // see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
    // for relative tweening
    let timeline = this.tweens.timeline({
      targets: this.enemyGroup.getChildren(),
      loop: -1,
      tweens: [
        {
          x: "-=50",
          ease: "Sine.easeInOut",
          duration: 500,
          offset: 0,
          yoyo: true
        },
        {
          y: "+=200",
          ease: "Sine.easeOut",
          duration: 500,
          yoyo: true,
          offset: 0
        },
      ]
    });

    console.log(timeline);
  }

  update() {
    console.log("asdasdasdads");
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
        sceneKey: "testScene",
      });
      this.scene.pause();
    }
  }
}

export default testScene;

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

    this.physics.add.overlap(this.enemyGroup, this.laserGroup, this.laserCollision, null, this);


    // see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
    // for relative tweening
    let enemyTimelineX = this.tweens.createTimeline();
    enemyTimelineX.add({
      targets: this.enemyGroup.getChildren(),
      x: "+=100",
      duration: 500,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
    });

    let enemyTimelineY = this.tweens.createTimeline();
    enemyTimelineY.add({
      targets: this.enemyGroup.getChildren(),
      y: "+=50",
      duration: 250,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
      loop: -1
    });
    enemyTimelineY.add({
      targets: this.enemyGroup.getChildren(),
      y: "-=50",
      duration: 250,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
      loop: -1,
    });

    enemyTimelineX.play();
    enemyTimelineY.play();

  }

  laserCollision(enemy, laser) {
    enemy.setActive(false);
    enemy.setVisible(false);
    laser.setActive(false);
    laser.setVisible(false);
    enemy.disableBody(true, true);
  }

  update() {
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
      //this.ship.setVelocityY(this.ship.body.velocity.y - 4);
      this.ship.setVelocityY(500 - this.ship.y);
    }
    if (this.keys.DOWN.isDown) {
      /*if (this.ship.y < 734) {
        this.ship.setVelocityY(this.ship.body.velocity.y + 4);
      }*/
      this.ship.setVelocityY(734 - this.ship.y);
    }
    if (this.keys.LEFT.isDown && !this.keys.RIGHT.isDown) {
      if (this.ship.body.velocity.x > 400) {
        this.ship.setTexture("ship");
      } else {
        this.ship.setTexture("ship_left");
      }
      this.ship.setVelocityX(this.ship.body.velocity.x - 10);
    }
    if (this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
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
      this.laserGroup.fireLaser(
        this.ship.x + this.ship.body.velocity.x * 0.03,
        this.ship.y - 48,
        this.ship.body.velocity.x,
        this.ship.body.velocity.y
      );
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      console.log("Esc detected, pausing game.");
      this.scene.launch("pauseMenuScene", {
        userData: this.userData,
        sceneKey: "testScene",
      });
      this.scene.pause();
    }
  }
}

export default testScene;

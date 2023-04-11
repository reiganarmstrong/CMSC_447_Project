import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
import EnemyGroup from "./helperClasses/EnemyGroup";
import EnemyLaserGroup from "./helperClasses/EnemyLaserGroup";
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
    this.load.image("enemyLaser", "assets/png/enemyLaser.png");
    this.load.image("sky", "assets/png/sky.png");
  }

  create() {
    this.add.image(512, 384, "sky");
    this.laserGroup = new LaserGroup(this);

    this.enemyGroup = new EnemyGroup(this);
    this.enemyLaserGroup = new EnemyLaserGroup(this);

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;
    this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    //this.ship.setCollideWorldBounds(true);

    this.debugText = this.add.text(16, 16, "hello");

    // dive bombing code:

    let enemies = this.enemyGroup;
    this.time.addEvent({
      delay: 3000, // every 10 seconds
      loop: true,
      callback: () => {

        // don't want to tell an enemy to divebomb when it is already in the middle of that
        // first, collect all of the enemies that are not currently diving and pick randomly from that
        let availableDivers = [];
        enemies.getChildren().forEach((enemy) => {
          if (enemy.active && enemy.getData("diving") !== "true") {
            availableDivers.push(enemy);
          }
        });

        // if all enemies are diving, wait for next callback
        if (availableDivers.length == 0) {
          console.log("all enemies diving, skipping");
          return;
        }

        let diveBomber = Phaser.Utils.Array.GetRandom(availableDivers);


        // first stop the current tween, we will then add a new one to replace it
        let diveBomberTweens = this.tweens.getTweensOf(diveBomber);
        diveBomberTweens.forEach((timeline) => {
          console.log(`type: ${timeline.constructor.name}`);
          timeline.stop();
          timeline.destroy();
        });

        diveBomber.setData("diving", "true");


        // create a new timeline for the new tween
        let diveBombTimeline = this.tweens.createTimeline();

        diveBombTimeline.add({
          targets: diveBomber,
          // add randomness to where the enemy ship dives to.
          // the current formula dives to a point calculated by a normal distribution
          // where the mean is half a ship length away. the ship can dive left or right of the ship by some
          // random offset calculated by a normal curve
          x: this.ship.x + Phaser.Math.Between(0, this.ship.width * 4) * Phaser.Math.RND.normal(),
          y: this.ship.y,
          duration: 1000,
          yoyo: true,
          onComplete: () => {
            diveBomber.setData("diving", "false");

            // create the new timelines to allow the ship to continue its original path
            // NOTE: offset value is used to avoid tween being slightly out of sync with other ships
            let defaultTimelineX = this.tweens.createTimeline();
            defaultTimelineX.add({
              targets: diveBomber,
              x: "+=100",
              duration: 500,
              ease: "Sine.InOut",
              yoyo: true,
              repeat: -1,
            });

            let defaultTimelineY = this.tweens.createTimeline();
            defaultTimelineY.add({
              targets: diveBomber,
              y: "+=50",
              duration: 250,
              ease: "Sine.InOut",
              yoyo: true,
              repeat: -1,
              loop: -1,
            });
            defaultTimelineY.add({
              targets: diveBomber,
              y: "-=50",
              duration: 250,
              ease: "Sine.InOut",
              yoyo: true,
              repeat: -1,
              loop: -1,
            });

            defaultTimelineX.play();
            defaultTimelineY.play();
          }
        });

        diveBombTimeline.play();
      },
      callbackScope: this
    });


    // add an event for each enemy to shoot between an interval
    this.enemyGroup.getChildren().forEach((enemy) => {
      this.time.addEvent({
        delay: Phaser.Math.FloatBetween(3, 7) * 1000,
        loop: true,
        callback: () => {
          console.log(`enemy shooting: ${enemy}`);
          if (enemy.active) {
            this.enemyLaserGroup.fireLaser(enemy.x, enemy.y + 48, enemy.body.velocity.x, 300);
          }
        },
        callbackScope: this
      });
    });

    // create collision detection between enemies and player lasers
    this.physics.add.overlap(this.enemyGroup, this.laserGroup, this.laserCollision, null, this);

    // create collision detection between player ship and enemy ships
    this.physics.add.overlap(this.ship, this.enemyGroup, this.playerEnemyBodyCollision, null, this);

    // create collision detection between enemy shots and player ship
    this.physics.add.overlap(this.ship, this.enemyLaserGroup, this.enemyLaserCollision, null, this);


    // see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
    // for relative tweening
    let enemyTimelinesX = [];
    let enemyTimelinesY = [];


    // add tweens to individual enemy ships
    this.enemyGroup.getChildren().forEach((enemy) => {
      let enemyTimelineX = this.tweens.createTimeline();
      enemyTimelineX.add({
        targets: enemy,
        x: "+=100",
        duration: 500,
        ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
      });

      enemyTimelinesX.push(enemyTimelineX);

      // the y tween is composed of two smaller tweens:
      // moving down for half the time and moving back up for half the time
      // this creates the semicircle effect
      let enemyTimelineY = this.tweens.createTimeline();
      enemyTimelineY.add({
        targets: enemy,
        y: "+=50",
        duration: 250,
        ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
        loop: -1
      });
      enemyTimelineY.add({
        targets: enemy,
        y: "-=50",
        duration: 250,
        ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
        loop: -1
      });
      enemyTimelinesY.push(enemyTimelineY);

      console.log("added tween");
    });

    enemyTimelinesX.forEach((timeline) => { timeline.play(); });
    enemyTimelinesY.forEach((timeline) => { timeline.play(); });
  }

  laserCollision(enemy, laser) {

    // disable the enemy and the laser that collided
    enemy.setActive(false);
    enemy.setVisible(false);
    laser.setActive(false);
    laser.setVisible(false);

    // this line is important so that the spot where the enemy was hit
    // does not keep absorbing lasers
    enemy.disableBody(true, true);
  }

  enemyLaserCollision(player, enemyLaser) {
    // disable the laser that collided
    enemyLaser.setActive(false);
    enemyLaser.setVisible(false);
    enemyLaser.disableBody(true, true);

    console.log(`player hit with enemy laser`);
  }

  playerEnemyBodyCollision(player, enemy) {
    console.log("player collided with enemy body");
    /*
    player.setActive(false);
    player.setVisible(false);
    enemy.setActive(false);
    enemy.setVisible(false);
    */
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

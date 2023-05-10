import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
import EnemyGroup from "./helperClasses/EnemyGroup";
import EnemyLaserGroup from "./helperClasses/EnemyLaserGroup";
import HeartGroup from "./helperClasses/HeartGroup";
class levelTwoScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "levelTwoScene" });
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
    this.load.image("bounceMissle", "assets/png/bounceMissle.png");
    this.load.image("enemy1", "assets/png/enemy1.png");
    this.load.image("enemyLaser", "assets/png/enemyLaser.png");
    this.load.image("sky", "assets/png/sky.png");
    this.load.image("ready", "assets/png/READY.png");
    this.load.image("fire", "assets/png/FIRE!!.png");
    this.load.image("time_up", "assets/png/TIME_UP.png");
    this.load.image("fail", "assets/png/MISSION_FAILED.png");
    this.load.image("level2", "assets/png/LEVEL2.png");
    this.load.audio("player_shoot", "assets/audio/player_shoot.mp3");
    this.load.audio("enemy_hit", "assets/audio/enemy_hit.mp3");
    this.load.image("shield", "assets/png/shield.png");
    this.load.image("shieldPowerup", "assets/png/shieldPowerup.png");
    this.load.image("doubleShotPowerup", "assets/png/doubleShotPowerup.png");
    this.load.image("bouncePowerup", "assets/png/bouncePowerup.png");
    this.load.image("piercePowerup", "assets/png/piercePowerup.png");
  }

  create() {
    console.log("create");
    //Phaser.Time.Clock;

    this.time_elapsed = this.add.Number;
    this.time_elapsed = 0;
    console.log("time_elapsed is supposed to be 0: " + this.time_elapsed);

    this.game_paused = this.add.Number;
    this.game_paused = 0;

    this.time_paused = this.add.Number;
    this.time_paused = 0;

    this.pause_start = this.add.Number;
    this.pause_start = 0;

    this.last_pause_start = this.add.Number;
    this.last_pause_start = 0;

    /*this.game_start_time_set = this.add.Number;
    this.game_start_time_set = 0;*/

    this.game_start_time = this.add.Number;
    this.game_start_time = 0;
    //this.game_start_time = Phaser.Scenes.SceneManager.getScene("levelTwoScene").time.now;
    //this.game_start_time = Phaser.Time.Clock.now;

    this.time_remaining = this.add.Number;
    this.time_remaining = 60;

    this.add.image(512, 768, "sky");

    this.ready_graphic = this.add.image(512, 350, "ready");
    this.level_graphic = this.add.image(512, 250, "level2");
    this.small_level_graphic = this.add.image(950, 30, "level2");
    this.small_level_graphic.scale = 0.5;
    this.fire_graphic = this.add.image(512, 350, "fire");
    this.fire_graphic.visible = false;
    this.time_up_graphic = this.add.image(512, 350, "time_up");
    this.time_up_graphic.visible = false;
    this.fail_graphic = this.add.image(512, 350, "fail");
    this.fail_graphic.visible = false;

    this.laserGroup = new LaserGroup(this);

    this.enemyGroup = new EnemyGroup(this, "enemy1", 2);
    this.enemyLaserGroup = new EnemyLaserGroup(this);

    this.kill_count = this.add.Number;
    this.kill_count = 0;

    this.enemies_remaining = this.add.Number;
    this.enemies_per_wave = this.add.Number;
    this.enemies_per_wave = 15;
    this.enemies_remaining = this.enemies_per_wave;

    this.ship_health = 5;
    this.heartGroup = new HeartGroup(this);
    for (let i = 0; i < this.ship_health; i++) {
      let hearts = this.heartGroup.getFirstDead();
      hearts.setActive(true);
      hearts.setVisible(true);
    }

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;
    this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    this.ship.body.velocity.x = 0;
    this.ship.body.velocity.y = 0;

    //this.ship.setCollideWorldBounds(true);

    this.debugText = this.add.text(16, 16, "");
    this.scoreText = this.add.text(400, 30, "", { font: "32px" });

    // dive bombing code:

    this.sound_player_shoot = this.sound.add("player_shoot");
    this.sound_enemy_hit = this.sound.add("enemy_hit");

    let enemies = this.enemyGroup;

    this.start_countdown = this.add.Number;
    this.start_countdown = 3;

    this.createPowerups();

    this.startEnemyMovementPattern();

    this.startEnemyShotPattern();

    this.createOverlaps();
  }

  update() {
    //if game_start_time is 0 it means the scene has just been created. for some reason it doesn't work
    //properly if i do this in create(), since it gets all weird when you pause or return to the main menu
    this.updateShieldPos();
    if (this.game_start_time == 0) {
      this.game_start_time = this.time.now;
    }
    if (
      this.pause_start != this.last_pause_start &&
      !this.scene.isPaused("levelTwoScene")
    ) {
      console.log("this thing happened");
      this.time_paused += this.time.now - this.pause_start;
      this.last_pause_start = this.pause_start;
      //this.time_remaining += this.time.now - this.pause_start;
      //this.pause_start = 0;
    }

    this.time_elapsed = this.time.now - this.time_paused - this.game_start_time;

    if (this.ship_health != 0) {
      this.time_remaining = Math.max(
        0,
        Number(60 - this.time_elapsed / 1000).toFixed(2)
      );
    }

    if (this.time_remaining != 0 && !this.scene.isPaused("levelTwoScene")) {
      this.physics.world.wrap(this.ship);
    }
    this.checkGameOver();

    if (this.time_remaining < 57 && !this.scene.isPaused("levelTwoScene")) {
      this.ready_graphic.visible = false;
      this.fire_graphic.visible = true;
      if (this.time_remaining < 56) {
        this.level_graphic.alpha -= 0.01;
        this.fire_graphic.alpha -= 0.01;
        //this.fire_graphic.visible = false;

        // commented this out for simplicity's sake
        if (this.time_remaining == 0) {
          this.time_up_graphic.visible = true;
        }
      }
    }

    //this should be zero because then the enemies start to get off-cycle from one another
    //form a huge group on one side of the screen
    if (this.enemies_remaining == 2) {
      //this.enemyGroup.destroy();
      //this.enemyLaserGroup.destroy();

      this.enemies_remaining += this.enemies_per_wave;

      this.enemyGroup = new EnemyGroup(this, "enemy1", 2);
      //this.enemyLaserGroup = new EnemyLaserGroup(this);

      //this.laserGroup.physicsType = Phaser.Physics.ARCADE;
      this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

      //this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC,G");
      //this.ship = this.physics.add.image(512, 700, "ship");
      //this.ship.setCollideWorldBounds(true);

      //this.debugText = this.add.text(16, 16, "hello");

      // dive bombing code:
      this.startEnemyMovementPattern();
      this.startEnemyShotPattern();
      this.createOverlaps();
    }

    this.scoreText.setText(
      "kill count: " +
        this.kill_count +
        "\n" +
        "time: " +
        this.time_remaining +
        "\n"
    );
    /*"health: " + this.ship_health + "\n" +
    "time paused: " + this.time_paused + "\n" +
    "start time: " + this.game_start_time + "\n" +
    "this.time.now: " + this.time.now + "\n" + 
    "this.time_elapsed: " + this.time_elapsed/1000);*/

    this.debugText.setText(
      "fps: " + Number(this.game.loop.actualFps).toFixed(1).toString() /*+
      "\n" +
      "y: " +
      this.ship.y +
      "\n" +
      "x: " +
      this.ship.x +
      "\n" +
      "y velocity: " +
      this.ship.body.velocity.y.toString() +
      "\n" +
      "x velocity: " +
      this.ship.body.velocity.x.toString() + 
      "\n" +

      "rotation: " +
      this.ship.body.rotation.toString() + 
      "\n"*/
    );

    if (this.time_remaining == 0 && !this.scene.isPaused("levelTwoScene")) {
      this.ship.setVelocityY(this.ship.body.velocity.y - 10);
      if (this.ship.y <= -100) {
        this.clearedLevel();
      }
    }

    if (this.ship_health != 0 && this.time_remaining != 0) {
      if (this.ship.y >= 734 && this.ship.body.velocity.y > 0) {
        this.ship.body.velocity.y = 0;
      }
      if (this.keys.UP.isDown) {
        //this.ship.setVelocityY(this.ship.body.velocity.y - 4);
        this.ship.setVelocityY(400 - this.ship.y);
        //this.ship.setVelocityY(-200*Math.sin((90 + this.ship.body.rotation)*(Math.PI/180)));
        //this.ship.setVelocityX(-200*Math.cos((90 + this.ship.body.rotation)*(Math.PI/180)));
      }
      if (this.keys.DOWN.isDown) {
        /*if (this.ship.y < 734) {
          this.ship.setVelocityY(this.ship.body.velocity.y + 4);
        }*/
        this.ship.setVelocityY(2 * (734 - this.ship.y));
      }
      if (this.keys.LEFT.isDown && !this.keys.RIGHT.isDown) {
        if (this.ship.body.velocity.x > 400) {
          this.ship.setTexture("ship");
        } else {
          this.ship.setTexture("ship_left");
        }
        if (this.ship.body.velocity.x >= -700 /*-200*/) {
          //this.ship.setVelocityX(this.ship.body.velocity.x - 20);
          this.ship.setVelocityX(
            this.ship.body.velocity.x +
              0.025 * (-700 - this.ship.body.velocity.x)
          );
          //this.ship.setVelocityX(this.ship.body.velocity.x + .05 * (-700 - this.ship.body.velocity.x));

          //this.ship.setVelocityX(-200);
        }
      }
      if (this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
        if (this.ship.body.velocity.x < -400) {
          this.ship.setTexture("ship");
        } else {
          this.ship.setTexture("ship_right");
        }
        if (this.ship.body.velocity.x <= 700 /*200*/) {
          //this.ship.setVelocityX(this.ship.body.velocity.x + 20);
          this.ship.setVelocityX(
            this.ship.body.velocity.x +
              0.025 * (700 - this.ship.body.velocity.x)
          );
          //this.ship.setVelocityX(this.ship.body.velocity.x + .05 * (700 - this.ship.body.velocity.x));

          //this.ship.setVelocityX(200);
        }
      }
      if (!this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
        this.ship.setTexture("ship");
        this.ship.setVelocityX(this.ship.body.velocity.x * 0.98);
      }
      if (!this.keys.UP.isDown && !this.keys.DOWN.isDown) {
        this.ship.setVelocityY(this.ship.body.velocity.y * 0.98);
      }
      if (this.time_remaining < 57 && !this.scene.isPaused("levelTwoScene")) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
          this.shoot();
        }
      }
    } else if (this.time_remaining != 0) {
      this.ship.setVelocityX(0);
      this.ship.setVelocityY(0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      if (!this.scene.isPaused("levelTwoScene")) {
        console.log("got time");
        this.pause_start = this.time.now;
      }
      console.log("Esc detected, pausing game.");
      this.scene.launch("pauseMenuScene", {
        userData: this.userData,
        sceneKey: "levelTwoScene",
      });
      this.scene.pause();
    }
  }

  startEnemyShotPattern() {
    // add an event for each enemy to shoot between an interval
    this.enemyGroup.getChildren().forEach((enemy) => {
      this.time.addEvent({
        delay: Phaser.Math.FloatBetween(1000, 7000),
        loop: true,
        callback: () => {
          // console.log(`enemy shooting: ${enemy}`);
          if (enemy.active && enemy.y < 400) {
            this.enemyLaserGroup.fireLaser(
              enemy.x,
              enemy.y + 48,
              enemy.body.velocity.x,
              300
            );
          }
        },
        callbackScope: this,
      });
    });
  }

  startEnemyMovementPattern() {
    let enemies = this.enemyGroup;
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.start_countdown != 0) {
          this.start_countdown -= 1;
          return;
        }

        // don't want to tell an enemy to divebomb when it is already in the middle of that
        // first, collect all of the enemies that are not currently diving and pick randomly from that
        let availableDivers = [];
        enemies.getChildren().forEach((enemy) => {
          console.log(enemy.body.velocity.x);
          if (enemy.active && enemy.getData("diving") !== "true") {
            availableDivers.push(enemy);
          }
          console.log(enemy.body.velocity.y);
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
          // console.log(`type: ${timeline.constructor.name}`);
          //recent
          //timeline.stop();
          //timeline.destroy();
        });

        diveBomber.setData("diving", "true");

        // create a new timeline for the new tween
        let diveBombTimeline = this.tweens.createTimeline();

        var side = Number(diveBomber.x > 512);
        var rot = Number(3.2 * Math.pow(-1, side));
        var timepoint = 0;
        var started = 0;
        var start_y = diveBomber.y;
        console.log("haha" + start_y);

        diveBombTimeline.add({
          /*onStart: () => {
            diveBomber.setRotation(180);
          },*/
          targets: diveBomber,
          duration: 6000,
          rotation: rot,
          // random offset calculated by a normal curve
          //bounce: 0,
          //x: 1,
          //x: this.ship.x + Phaser.Math.Between(0, this.ship.width * 4) * Phaser.Math.RND.normal(),
          //y: this.ship.y,
          //diveBomber.body.velocity.y: 200,
          //yoyo: true,

          onUpdate: () => {
            //frankly idk how time works in this
            timepoint += 30;
            //this system log doesn't work somehow (because it's supposed to be console.log() you dingus)
            //system.log("lol");
            //these rotation lines just doesn't work
            //diveBomber.setRotation(diveBomber.body.rotation + 0.0000000000001);
            //diveBomber.body.rotation += 1
            //diveBomber.setVelocityY((timepoint/2700) * 800 * Math.sin((diveBomber.body.rotation+90)*(Math.PI/180)));

            if (started == 1) {
              //you CAN'T do it like this!!
              //if((start_y + 100) >= diveBomber.y >= start_y){
              //you HAVE to do it like this
              if (start_y + 20 >= diveBomber.y && diveBomber.y >= start_y) {
                diveBomber.setVelocityY(0);
                //this is EXACTLY how you freaking do it
                //the velocity refers to the distance you're going to move in the next update (i'm pretty sure)
                diveBomber.y = start_y + diveBomber.body.velocity.y;
                diveBomber.setVelocityX(0);
                diveBomber.setRotation(0);
              } else {
                diveBomber.setVelocityY(
                  200 *
                    Math.sin(
                      (diveBomber.body.rotation + 90) /*-180*/ * (Math.PI / 180)
                    )
                );
                diveBomber.setVelocityX(
                  Math.pow(-1, side) *
                    300 *
                    Math.cos(
                      2 *
                        (diveBomber.body.rotation + 90) /*-180*/ *
                        (Math.PI / 180)
                    )
                );
              }
            } else {
              diveBomber.setVelocityY(
                200 *
                  Math.sin(
                    (diveBomber.body.rotation + 90) /*-180*/ * (Math.PI / 180)
                  )
              );
              diveBomber.setVelocityX(
                Math.pow(-1, side) *
                  300 *
                  Math.cos(
                    2 *
                      (diveBomber.body.rotation + 90) /*-180*/ *
                      (Math.PI / 180)
                  )
              );
              if (diveBomber.y > start_y + 20) {
                started = 1;
              }
            }
          },

          onComplete: () => {
            diveBomber.setVelocityY(0);
            diveBomber.setVelocityX(0);
            diveBomber.setRotation(0);
            diveBomber.setData("diving", "false");
          },
        });

        console.log("lmao");
        diveBombTimeline.play();
      },
      callbackScope: this,
    });
  }
  checkGameOver() {
    if (this.ship_health == 0) {
      this.ready_graphic.setVisible(false);
      this.fire_graphic.setVisible(false);
      this.level_graphic.setVisible(false);
      this.scene.launch("deathMenuScene", {
        userData: this.userData,
        sceneKey: "levelTwoScene",
      });
      this.scene.pause();
    }
  }

  clearedLevel() {
    this.scene.launch("clearMenuScene", {
      userData: this.userData,
      sceneKey: "levelTwoScene",
      killCount: this.kill_count,
      lifeCount: this.ship_health,
    });
    this.scene.stop();
  }

  decrementHealth() {
    this.ship_health--;
    let heart = this.heartGroup.getLastNth(1, true);
    heart.setActive(false);
    heart.setVisible(false);
  }

  laserCollision(enemy, laser) {
    // disable the enemy and the laser that collided
    this.sound_enemy_hit.play();
    enemy.disableBody(true, true);
    if (this.pierceShots == false) {
      laser.disableBody(true, true);
    }
    this.enemies_remaining -= 1;
    this.kill_count += 1;
  }
  enemyLaserCollision(player, enemyLaser) {
    if (this.time_remaining != 0 && !this.scene.isPaused("levelTwoScene")) {
      this.decrementHealth();
      enemyLaser.disableBody(true, true);
    }
    if (this.doubleShot) {
      this.doubleShot = false;
    }
    if (this.bounceShots) {
      this.stopBouncing();
    }
    if (this.pierceShots) {
      this.pierceShots = false;
    }
  }

  playerEnemyBodyCollision(player, enemy) {
    if (this.time_remaining != 0 && !this.scene.isPaused("levelTwoScene")) {
      this.decrementHealth();

      enemy.disableBody(true, true);
      this.enemies_remaining -= 1;
    }
    if (this.doubleShot) {
      this.doubleShot = false;
    }
    if (this.bouceShots) {
      this.stopBouncing();
    }
    if (this.pierceShots) {
      this.pierceShots = false;
    }
  }
  shieldLaserCollision(shield, enemyLaser) {
    enemyLaser.disableBody(true, true);
    this.destroyShield();
  }

  shieldEnemyCollision(shield, enemy) {
    enemy.disableBody(true, true);
    this.destroyShield();
  }

  shieldPowerupCollision(ship, shieldPowerup) {
    if (this.shield != undefined) {
      this.destroyShield();
    }

    shieldPowerup.disableBody(true, true);
    this.createShield();
  }

  createShield() {
    this.shieldUp = true;
    this.shield = this.physics.add.image(this.ship.x, this.ship.y, "shield");
    this.shield.body.setVelocity(
      this.ship.body.velocity.x,
      this.ship.body.velocity.y
    );
    // shield and enemy laser collision
    this.physics.add.overlap(
      this.shield,
      this.enemyLaserGroup,
      this.shieldLaserCollision,
      null,
      this
    );

    // shield and enemy collision
    this.physics.add.overlap(
      this.shield,
      this.enemyGroup,
      this.shieldEnemyCollision,
      null,
      this
    );
  }
  updateShieldPos() {
    if (this.shieldUp) {
      this.physics.world.wrap(this.shield);
      this.shield.body.x = this.ship.body.x - 48 / 2;
      this.shield.body.y = this.ship.body.y - 52 / 2;
    }
  }

  destroyShield() {
    this.shieldUp = false;
    this.shield.destroy();
  }
  createShieldPowerup() {
    const randX = Math.floor(Math.random() * 990 + 34);
    const randY = Math.floor(Math.random() * 200 + 500);
    while (randX > 1024 / 2 + 40 && randX < 1024 / 2 - 40) {
      randX = Math.floor(Math.random() * 990 + 34);
    }
    this.shieldUp = false;
    this.shieldPowerup = this.physics.add.image(randX, randY, "shieldPowerup");
    // this.physics.add.overlap(
    //   this.ship,
    //   this.shieldPowerup,
    //   this.shieldPowerupCollision,
    //   null,
    //   this
    // );
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        // refreshes shield powerup
        this.shieldPowerup.setX(Math.floor(Math.random() * 990 + 34));
        this.shieldPowerup.setY(Math.floor(Math.random() * 200 + 500));

        if (!this.shieldPowerup.active) {
          this.shieldPowerup.setActive(true);
          this.shieldPowerup.enableBody();
          this.shieldPowerup.setVisible(true);
        }
      },
      loop: true,
    });
  }

  doubleShotPowerupCollision(ship, doubleShotPowerup) {
    this.doubleShot = true;
    doubleShotPowerup.disableBody(true, true);
  }
  createDoubleShotPowerup() {
    const randX = Math.floor(Math.random() * 990 + 34);
    const randY = Math.floor(Math.random() * 200 + 500);
    while (randX > 1024 / 2 + 40 && randX < 1024 / 2 - 40) {
      randX = Math.floor(Math.random() * 990 + 34);
    }
    this.laserGroup2 = new LaserGroup(this);
    // this.physics.add.overlap(
    //   this.enemyGroup,
    //   this.laserGroup2,
    //   this.laserCollision,
    //   null,
    //   this
    // );
    this.doubleShot = false;
    this.doubleShotPowerup = this.physics.add.image(
      randX,
      randY,
      "doubleShotPowerup"
    );
    // this.physics.add.overlap(
    //   this.ship,
    //   this.doubleShotPowerup,
    //   this.doubleShotPowerupCollision,
    //   null,
    //   this
    // );
    this.time.addEvent({
      delay: 4500,
      callback: () => {
        // refreshes shield powerup
        this.doubleShotPowerup.setX(Math.floor(Math.random() * 990 + 34));
        this.doubleShotPowerup.setY(Math.floor(Math.random() * 200 + 500));

        if (!this.doubleShotPowerup.active) {
          this.doubleShotPowerup.setActive(true);
          this.doubleShotPowerup.enableBody();
          this.doubleShotPowerup.setVisible(true);
        }
      },
      loop: true,
    });
  }
  bounceShotPowerupCollision(ship, bounceShotPowerup) {
    this.startBouncing();
    bounceShotPowerup.disableBody(true, true);
  }
  createBounceShotPowerup() {
    const randX = Math.floor(Math.random() * 990 + 34);
    const randY = Math.floor(Math.random() * 200 + 500);
    while (randX > 1024 / 2 + 40 && randX < 1024 / 2 - 40) {
      randX = Math.floor(Math.random() * 990 + 34);
    }

    this.bouceShots = false;
    this.bounceShotPowerup = this.physics.add.image(
      randX,
      randY,
      "bouncePowerup"
    );
    // this.physics.add.overlap(
    //   this.ship,
    //   this.bounceShotPowerup,
    //   this.bounceShotPowerupCollision,
    //   null,
    //   this
    // );
    this.time.addEvent({
      delay: 4750,
      callback: () => {
        // refreshes shield powerup
        this.bounceShotPowerup.setX(Math.floor(Math.random() * 990 + 34));
        this.bounceShotPowerup.setY(Math.floor(Math.random() * 200 + 500));

        if (!this.bounceShotPowerup.active) {
          this.bounceShotPowerup.setActive(true);
          this.bounceShotPowerup.enableBody();
          this.bounceShotPowerup.setVisible(true);
        }
      },
      loop: true,
    });
  }
  startBouncing() {
    this.bounceShots = true;
    this.laserGroup.getChildren().forEach((child) => {
      child.makeBounce();
    });
    if (this.laserGroup2) {
      this.laserGroup2.getChildren().forEach((child) => {
        child.makeBounce();
      });
    }
  }
  stopBouncing() {
    this.bounceShots = false;
    this.laserGroup.getChildren().forEach((child) => {
      child.stopBounce();
    });
    if (this.laserGroup2) {
      this.laserGroup2.getChildren().forEach((child) => {
        child.stopBounce();
      });
    }
  }
  pierceShotPowerupCollision(ship, pierceShotPowerup) {
    this.pierceShots = true;
    pierceShotPowerup.disableBody(true, true);
  }
  createPierceShotPowerup() {
    const randX = Math.floor(Math.random() * 990 + 34);
    const randY = Math.floor(Math.random() * 200 + 500);
    while (randX > 1024 / 2 + 40 && randX < 1024 / 2 - 40) {
      randX = Math.floor(Math.random() * 990 + 34);
    }

    this.pierceShots = false;
    this.pierceShotPowerup = this.physics.add.image(
      randX,
      randY,
      "piercePowerup"
    );
    // this.physics.add.overlap(
    //   this.ship,
    //   this.pierceShotPowerup,
    //   this.pierceShotPowerupCollision,
    //   null,
    //   this
    // );
    this.time.addEvent({
      delay: 4800,
      callback: () => {
        // refreshes shield powerup
        this.pierceShotPowerup.setX(Math.floor(Math.random() * 990 + 34));
        this.pierceShotPowerup.setY(Math.floor(Math.random() * 200 + 500));

        if (!this.pierceShotPowerup.active) {
          this.pierceShotPowerup.setActive(true);
          this.pierceShotPowerup.enableBody();
          this.pierceShotPowerup.setVisible(true);
        }
      },
      loop: true,
    });
  }
  createPowerups() {
    this.createShieldPowerup();
    this.createDoubleShotPowerup();
    this.createBounceShotPowerup();
    this.createPierceShotPowerup();
  }
  shoot() {
    this.sound_player_shoot.play();
    const doubleShotOffset = 20;
    if (this.doubleShot == false) {
      this.laserGroup.fireLaser(
        this.ship.x + this.ship.body.velocity.x * 0.03,
        this.ship.y - 48,
        this.ship.body.velocity.x,
        this.ship.body.velocity.y
      );
    } else if (
      this.laserGroup.getFirstDead(false) &&
      this.laserGroup2.getFirstDead(false)
    ) {
      this.laserGroup.fireLaser(
        this.ship.x + this.ship.body.velocity.x * 0.03 - doubleShotOffset,
        this.ship.y - 48,
        this.ship.body.velocity.x,
        this.ship.body.velocity.y
      );
      this.laserGroup2.fireLaser(
        this.ship.x + this.ship.body.velocity.x * 0.03 + doubleShotOffset,
        this.ship.y - 48,
        this.ship.body.velocity.x,
        this.ship.body.velocity.y
      );
    }
  }
  createOverlaps() {
    // create collision detection between enemies and player lasers
    this.physics.add.overlap(
      this.enemyGroup,
      this.laserGroup,
      this.laserCollision,
      null,
      this
    );
    // create collision detection between player ship and enemy ships
    this.physics.add.overlap(
      this.ship,
      this.enemyGroup,
      this.playerEnemyBodyCollision,
      null,
      this
    );

    // create collision detection between enemy shots and player ship
    this.physics.add.overlap(
      this.ship,
      this.enemyLaserGroup,
      this.enemyLaserCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.enemyGroup,
      this.laserGroup2,
      this.laserCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.doubleShotPowerup,
      this.doubleShotPowerupCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.shieldPowerup,
      this.shieldPowerupCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.bounceShotPowerup,
      this.bounceShotPowerupCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.pierceShotPowerup,
      this.pierceShotPowerupCollision,
      null,
      this
    );
    // shield and enemy laser collision
    if (this.shieldUp) {
      this.physics.add.overlap(
        this.shield,
        this.enemyLaserGroup,
        this.shieldLaserCollision,
        null,
        this
      );

      // shield and enemy collision
      this.physics.add.overlap(
        this.shield,
        this.enemyGroup,
        this.shieldEnemyCollision,
        null,
        this
      );
    }
  }
}

export default levelTwoScene;

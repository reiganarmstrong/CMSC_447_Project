import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
import EnemyLaserGroup from "./helperClasses/EnemyLaserGroup";
import BossLaserGroup from "./helperClasses/BossLaserGroup";
import BossBigLaserGroup from "./helperClasses/BossBigLaserGroup";

class bossScene extends Scene {
  constructor(config) {
    super(config);
    Phaser.Scene.call(this, { key: "bossScene" });
  }

  init(userData) {
    this.userData = userData;
  }

  preload() {
    // must load from webserver (even if localhost) instead of from a local file
    // due to security reasons
    this.load.image("bounceMissle", "assets/png/bounceMissle.png");

    this.load.image("ship", "assets/png/ship.png");
    this.load.image("ship_left", "assets/png/ship_left.png");
    this.load.image("ship_right", "assets/png/ship_right.png");
    this.load.image("missile", "assets/png/missile.png");
    this.load.image("enemyLaser", "assets/png/enemyLaser.png");
    this.load.image("bossLaser", "assets/png/bossLaser.png");
    this.load.image("bossLaserBig", "assets/png/bossLaserBig.png");
    this.load.image("sky", "assets/png/sky.png");
    this.load.image("ready", "assets/png/READY.png");
    this.load.image("fire", "assets/png/FIRE!!.png");
    this.load.image("time_up", "assets/png/TIME_UP.png");
    this.load.image("fail", "assets/png/MISSION_FAILED.png");
    this.load.image("level", "assets/png/LEVEL1.png");
    this.load.audio("player_shoot", "assets/audio/player_shoot.mp3");
    this.load.audio("enemy_hit", "assets/audio/enemy_hit.mp3");
    this.load.audio("player_hit", "assets/audio/player_hit.mp3");
    this.load.image("shield", "assets/png/shield.png");
    this.load.image("shieldPowerup", "assets/png/shieldPowerup.png");
    this.load.image("doubleShotPowerup", "assets/png/doubleShotPowerup.png");
    this.load.image("bouncePowerup", "assets/png/bouncePowerup.png");
    this.load.image("piercePowerup", "assets/png/piercePowerup.png");
    this.load.image("boss", "assets/png/enemy5.png");

    this.load.audio("start_sound", "assets/audio/start_sound.mp3");
    this.load.audio("level_sound", "assets/audio/level_music.mp3");
  }

  create() {
    /*

        BACKGROUND EFFECT COMMENTED OUT FOR NOW SINCE IT DOES NOT GET THE RIGHT HEIGHT/WIDTH
        BACKGROUND EFFECT COMMENTED OUT FOR NOW SINCE IT DOES NOT GET THE RIGHT HEIGHT/WIDTH
        BACKGROUND EFFECT COMMENTED OUT FOR NOW SINCE IT DOES NOT GET THE RIGHT HEIGHT/WIDTH
        BACKGROUND EFFECT COMMENTED OUT FOR NOW SINCE IT DOES NOT GET THE RIGHT HEIGHT/WIDTH
        BACKGROUND EFFECT COMMENTED OUT FOR NOW SINCE IT DOES NOT GET THE RIGHT HEIGHT/WIDTH
        
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
        */

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
    //this.game_start_time = Phaser.Scenes.SceneManager.getScene("levelOneScene").time.now;
    //this.game_start_time = Phaser.Time.Clock.now;

    this.time_remaining = this.add.Number;
    this.time_remaining = 60;

    this.add.image(512, 768, "sky");

    this.ready_graphic = this.add.image(512, 350, "ready");
    // this.level_graphic = this.add.image(512, 250, "level");
    // this.small_level_graphic = this.add.image(950, 30, "level");
    // this.small_level_graphic.scale = 0.5;
    this.fire_graphic = this.add.image(512, 350, "fire");
    this.fire_graphic.visible = false;
    this.time_up_graphic = this.add.image(512, 350, "time_up");
    this.time_up_graphic.visible = false;
    this.fail_graphic = this.add.image(512, 350, "fail");
    this.fail_graphic.visible = false;

    this.health1 = this.add.image(50, 730, "ship");
    this.health1.scale = 0.7;
    this.health2 = this.add.image(100, 730, "ship");
    this.health2.scale = 0.7;
    this.health3 = this.add.image(150, 730, "ship");
    this.health3.scale = 0.7;
    this.health4 = this.add.image(200, 730, "ship");
    this.health4.scale = 0.7;
    this.health5 = this.add.image(250, 730, "ship");
    this.health5.scale = 0.7;

    this.laserGroup = new LaserGroup(this);

    this.enemyLaserGroup = new EnemyLaserGroup(this);

    this.bossBigLaserGroup = new BossBigLaserGroup(this);

    this.kill_count = this.add.Number;
    this.kill_count = 0;

    this.enemies_remaining = this.add.Number;
    this.enemies_per_wave = this.add.Number;
    this.enemies_per_wave = 15;
    this.enemies_remaining = this.enemies_per_wave;

    this.ship_health = 5;

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    this.ship.body.velocity.x = 0;
    this.ship.body.velocity.y = 0;

    // add the boss ship
    this.boss = this.physics.add.image(200, 30, "boss");
    this.bossLaserGroup = new BossLaserGroup(this);
    this.createPowerups();

    this.createOverlaps();

    // const boss = this.boss;

    //this.ship.setCollideWorldBounds(true);

    this.debugText = this.add.text(16, 16, "");
    this.scoreText = this.add.text(400, 30, "", { font: "32px" });

    this.sound_player_shoot = this.sound.add("player_shoot");
    this.sound_player_hit = this.sound.add("player_hit");
    this.sound_enemy_hit = this.sound.add("enemy_hit");

    this.start_countdown = this.add.Number;
    this.start_countdown = 3;

    this.time.addEvent({
      delay: Phaser.Math.Between(500, 1000),
      loop: true,
      callback: () => {
        const velX = Phaser.Math.Between(220, 350);
        const width = Phaser.Math.Between(30, 90);
        if (this.boss.health > 0) {
          this.bossLaserGroup.fireLaser(
            this.boss.x,
            this.boss.y,
            velX,
            250,
            width
          );
        }
      },
    });

    /*
        const bossMovementTimeline = this.tweens.timeline({
            targets: boss,
            ease: 'Linear',
            tweens: [

            ]
        })
        */

    // see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
    // for relative tweening
    let bossTimelineX = this.tweens.createTimeline();
    bossTimelineX.add({
      targets: this.boss,
      x: "+=" + Phaser.Math.Between(500, 700),
      duration: 950,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
    });

    let bossTimelineY = this.tweens.createTimeline();
    bossTimelineY.add({
      targets: this.boss,
      y: "+=250",
      duration: 550,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
      loop: -1,
    });
    bossTimelineY.add({
      targets: this.boss,
      y: "-=250",
      duration: 550,
      ease: "Sine.InOut",
      yoyo: true,
      repeat: -1,
      loop: -1,
    });

    bossTimelineX.play();
    bossTimelineY.play();

    const bigShotConfig = {
      targets: this.boss,
      x: Phaser.Math.Between(10, 700),
      y: Phaser.Math.Between(25, 50),
      duration: 1100,
      yoyo: true,
      onYoyo: () => {
        // FIXME: this callback is executed twice... not sure why
        console.log(`YOYO'D`);
        // const sign = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;
        // this.bossBigLaserGroup.fireLaser(this.boss.x, this.boss.y, sign * Phaser.Math.Between(70, 120), 200, 90);
        if (this.boss.health > 0) {
          this.bossBigLaserGroup.fireLaser(
            this.boss.x,
            this.boss.y,
            100,
            200,
            90
          );
        }
      },
      ease: "Sine.InOut",
      onStart: () => {
        bossTimelineX.pause();
        bossTimelineY.pause();
      },
      onComplete: () => {
        bossTimelineX.resume();
        bossTimelineY.resume();
      },
    };

    /*
        const bigLaserTimelineY = this.tweens.createTimeline();
        bigLaserTimelineY.add({
            targets: this.boss,
            y: "30",
            duration: 1000,
            ease: "Sine.InOut",
        });
        */

    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 10000),
      repeat: -1,
      loop: true,
      callback: () => {
        console.log("in big laser timeline callback");
        const bigLaserTimeline = this.tweens.createTimeline();
        bigLaserTimeline.add(bigShotConfig);
        // update to new x/y values
        bigShotConfig.x = Phaser.Math.Between(10, 700);
        bigShotConfig.y = Phaser.Math.Between(25, 50);
        bigLaserTimeline.play();
      },
      // onComplete: () => { bigLaserTimeline.stop(); },
      callbackScope: this,
    });

    // boss takes 15 hits
    this.boss.health = 45;

    this.strtS = this.sound.add("start_sound");
    this.lvlS = this.sound.add("level_sound");
    this.strtS.play();
    this.strtS.on('complete', function() {
      this.lvlS.play();
      this.lvlS.setVolume(0.25);
      this.lvlS.setLoop(true);
    }.bind(this));
  }

  playerLaserBossCollision(laser, boss) {
    // disable the enemy and the laser that collided
    this.sound_enemy_hit.play();
    this.boss.health--;
    if (this.boss.health == 0) {
      this.kill_count += 1;
      boss.disableBody(true, true);

      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      this.clearedLevel();
    }
    // console.log(this.pierceShots);
    // if (this.pierceShots == false) {
    laser.disableBody(true, true);
    // }
    // this.enemies_remaining -= 1;
    // this.kill_count += 1;
  }

  bossLaserCollision(player, enemyLaser) {
    if (this.time_remaining != 0 && !this.scene.isPaused("bossScene")) {
      this.ship.setAlpha(0);
      this.sound_player_hit.play();
      // disable the laser that collided
      this.ship_health -= 1;
      if (this.ship_health == 4) {
        this.health5.visible = false;
      }
      if (this.ship_health == 3) {
        this.health4.visible = false;
      }
      if (this.ship_health == 2) {
        this.health3.visible = false;
      }
      if (this.ship_health == 1) {
        this.health2.visible = false;
      }
      if (this.ship_health == 0) {
        this.health1.visible = false;
      }
      enemyLaser.disableBody(true, true);
      if (this.ship_health == 0) {
        this.ship.disableBody(true, true);
      }
    }
  }

  bossBigLaserCollision(player, bigLaser) {
    bigLaser.disableBody(true, true);
    if (this.time_remaining != 0 && !this.scene.isPaused("bossScene")) {
      this.ship.setAlpha(0);
      this.sound_player_hit.play();
      // big laser takes 2 hits
      for (let i = 0; i < 2; i++) {
        this.ship_health -= 1;
        if (this.ship_health == 4) {
          this.health5.visible = false;
        }
        if (this.ship_health == 3) {
          this.health4.visible = false;
        }
        if (this.ship_health == 2) {
          this.health3.visible = false;
        }
        if (this.ship_health == 1) {
          this.health2.visible = false;
        }
        if (this.ship_health == 0) {
          this.health1.visible = false;
        }

        if (this.ship_health <= 0) {
          this.checkGameOver();
        }
      }
    }
    // console.log("player collided with enemy body");
  }

  bigBossShieldLaserCollision(shield, bigLaser) {
    this.sound_player_hit.play();
    bigLaser.disableBody(true, true);
    this.destroyShield();
  }

  update() {
    if(this.ship.alpha != 1){
      this.ship.setAlpha(this.ship.alpha + 0.05);
    }
    this.updateShieldPos();
    //if game_start_time is 0 it means the scene has just been created. for some reason it doesn't work
    //properly if i do this in create(), since it gets all weird when you pause or return to the main menu
    if (this.game_start_time == 0) {
      this.game_start_time = this.time.now;
    }

    if (
      this.pause_start != this.last_pause_start &&
      !this.scene.isPaused("bossScene")
    ) {
      console.log("this thing happened");
      this.time_paused += this.time.now - this.pause_start;
      this.last_pause_start = this.pause_start;
      //this.time_remaining += this.time.now - this.pause_start;
      //this.pause_start = 0;
      this.lvlS.resume()
      this.strtS.resume()
    }

    this.time_elapsed = this.time.now - this.time_paused - this.game_start_time;

    if (this.ship_health != 0) {
      this.time_remaining = Math.max(
        0,
        Number(60 - this.time_elapsed / 1000).toFixed(2)
      );
    }

    if (this.time_remaining != 0 && !this.scene.isPaused("bossScene")) {
      this.physics.world.wrap(this.ship);
    }
    this.checkGameOver();

    if (this.time_remaining < 57 && !this.scene.isPaused("bossScene")) {
      this.ready_graphic.visible = false;
      this.fire_graphic.visible = true;
      if (this.time_remaining < 56) {
        // this.level_graphic.alpha -= 0.01;
        this.fire_graphic.alpha -= 0.01;
        //this.fire_graphic.visible = false;
        if (this.time_remaining == 0) {
          this.time_up_graphic.visible = true;
        }
      }
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

    if (this.time_remaining == 0 && !this.scene.isPaused("bossScene")) {
      this.ship.setVelocityY(this.ship.body.velocity.y - 10);
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
      if (this.time_remaining < 57 && !this.scene.isPaused("bossScene")) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
          this.sound_player_shoot.play();
          this.shoot();
        }
      }
    } else if (this.time_remaining != 0) {
      this.ship.setVelocityX(0);
      this.ship.setVelocityY(0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      if (!this.scene.isPaused("bossScene")) {
        console.log("got time");
        this.pause_start = this.time.now;
      }
      console.log("Esc detected, pausing game.");
      this.lvlS.pause();
      this.strtS.pause();
      this.scene.launch("pauseMenuScene", {
        userData: this.userData,
        sceneKey: "bossScene",
      });
      this.scene.pause();
    }

    this.bossLaserGroup.getChildren().forEach((laser) => {
      laser.update();
    });
    this.bossBigLaserGroup.getChildren().forEach((laser) => {
      laser.update();
    });
  }
  checkGameOver() {
    if (this.ship_health == 0) {
      this.lvlS.stop();
      this.ship.setAlpha(0);
      this.ready_graphic.setVisible(false);
      this.fire_graphic.setVisible(false);
      //   this.level_graphic.setVisible(false);
      this.scene.launch("deathMenuScene", {
        userData: this.userData,
        sceneKey: "bossScene",
      });
      this.scene.pause();
    }
  }

  clearedLevel() {
    this.lvlS.stop();
    this.scene.launch("clearMenuScene", {
      userData: this.userData,
      sceneKey: "bossScene",
      killCount: this.kill_count,
      lifeCount: this.ship_health,
    });
    this.scene.stop();
  }

  laserCollision(enemy, laser) {
    // disable the enemy and the laser that collided
    this.sound_enemy_hit.play();

    this.boss.health--;
    if (this.boss.health == 0) {
      this.kill_count += 1;
      enemy.disableBody(true, true);

      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      // XXX: THIS IS WHERE THE LEVEL CAN END
      this.clearedLevel();
    }
    // if (this.pierceShots == false) {
    laser.disableBody(true, true);
    // }
  }
  enemyLaserCollision(player, enemyLaser) {
    this.sound_player_hit.play();
    if (this.time_remaining != 0 && !this.scene.isPaused("levelOneScene")) {
      this.decrementHealth();
      enemyLaser.disableBody(true, true);
    }
    if (this.doubleShot) {
      this.doubleShot = false;
    }
    if (this.bounceShots) {
      this.stopBouncing();
    }
    // if (this.pierceShots) {
    // this.pierceShots = false;
    // }
  }

  playerEnemyBodyCollision(player, enemy) {
    this.sound_player_hit.play();
    if (this.time_remaining != 0 && !this.scene.isPaused("levelOneScene")) {
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
    // if (this.pierceShots) {
    // this.pierceShots = false;
    // }
  }
  shieldLaserCollision(shield, enemyLaser) {
    this.sound_player_hit.play();
    enemyLaser.disableBody(true, true);
    this.destroyShield();
  }

  shieldEnemyCollision(shield, enemy) {
    this.sound_player_hit.play();

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
      this.bossLaserGroup,
      this.shieldLaserCollision,
      null,
      this
    );

    // shield and enemy collision
    this.physics.add.overlap(
      this.shield,
      this.boss,
      this.shieldEnemyCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.shield,
      this.bossBigLaserGroup,
      this.bigBossShieldLaserCollision,
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
    //   this.boss,
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
  //   pierceShotPowerupCollision(ship, pierceShotPowerup) {
  //     this.pierceShots = true;
  //     pierceShotPowerup.disableBody(true, true);
  //   }
  //   createPierceShotPowerup() {
  //     const randX = Math.floor(Math.random() * 990 + 34);
  //     const randY = Math.floor(Math.random() * 200 + 500);
  //     while (randX > 1024 / 2 + 40 && randX < 1024 / 2 - 40) {
  //       randX = Math.floor(Math.random() * 990 + 34);
  //     }

  //     this.pierceShots = false;
  //     this.pierceShotPowerup = this.physics.add.image(
  //       randX,
  //       randY,
  //       "piercePowerup"
  //     );
  //     // this.physics.add.overlap(
  //     //   this.ship,
  //     //   this.pierceShotPowerup,
  //     //   this.pierceShotPowerupCollision,
  //     //   null,
  //     //   this
  //     // );
  //     this.time.addEvent({
  //       delay: 4800,
  //       callback: () => {
  //         // refreshes shield powerup
  //         this.pierceShotPowerup.setX(Math.floor(Math.random() * 990 + 34));
  //         this.pierceShotPowerup.setY(Math.floor(Math.random() * 200 + 500));

  //         if (!this.pierceShotPowerup.active) {
  //           this.pierceShotPowerup.setActive(true);
  //           this.pierceShotPowerup.enableBody();
  //           this.pierceShotPowerup.setVisible(true);
  //         }
  //       },
  //       loop: true,
  //     });
  //   }
  createPowerups() {
    this.createShieldPowerup();
    this.createDoubleShotPowerup();
    this.createBounceShotPowerup();
    // this.createPierceShotPowerup();
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
      this.boss,
      this.laserGroup,
      this.laserCollision,
      null,
      this
    );
    // create collision detection between player ship and enemy ships
    this.physics.add.overlap(
      this.ship,
      this.boss,
      this.playerEnemyBodyCollision,
      null,
      this
    );

    // create collision detection between enemy shots and player ship
    this.physics.add.overlap(
      this.ship,
      this.bossLaserGroup,
      this.enemyLaserCollision,
      null,
      this
    );
    this.physics.add.overlap(
      this.boss,
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
    // this.physics.add.overlap(
    //   this.ship,
    //   this.pierceShotPowerup,
    //   this.pierceShotPowerupCollision,
    //   null,
    //   this
    // );
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
        this.boss,
        this.shieldEnemyCollision,
        null,
        this
      );
      this.physics.add.overlap(
        this.shield,
        this.bossBigLaserGroup,
        this.bigBossShieldLaserCollision,
        null,
        this
      );
    }
    this.physics.add.overlap(
      this.ship,
      this.bossBigLaserGroup,
      this.bossBigLaserCollision,
      null,
      this
    );
  }
  decrementHealth() {
    this.ship_health -= 1;
    if (this.ship_health == 4) {
      this.health5.visible = false;
    }
    if (this.ship_health == 3) {
      this.health4.visible = false;
    }
    if (this.ship_health == 2) {
      this.health3.visible = false;
    }
    if (this.ship_health == 1) {
      this.health2.visible = false;
    }
    if (this.ship_health == 0) {
      this.health1.visible = false;
    }

    if (this.ship_health <= 0) {
      this.checkGameOver();
    }
  }
}

export default bossScene;

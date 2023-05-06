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
    this.load.image("ready", "assets/png/READY.png")
    this.load.image("fire", "assets/png/FIRE!!.png")
    this.load.image("time_up", "assets/png/TIME_UP.png")
    this.load.image("fail", "assets/png/MISSION_FAILED.png")
    this.load.image("level", "assets/png/LEVEL1.png")
  }


  create() {
    console.log("create")
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
    //this.game_start_time = Phaser.Scenes.SceneManager.getScene("testScene").time.now;
    //this.game_start_time = Phaser.Time.Clock.now;
    
    this.time_remaining = this.add.Number;
    this.time_remaining = 60;


    this.add.image(512, 768, "sky");

    this.ready_graphic = this.add.image(512, 350, "ready");
    this.level_graphic = this.add.image(512, 250, "level");
    this.small_level_graphic = this.add.image(950, 30, "level");
    this.small_level_graphic.scale = 0.5
    this.fire_graphic = this.add.image(512, 350, "fire");
    this.fire_graphic.visible = false;
    this.time_up_graphic = this.add.image(512, 350, "time_up");
    this.time_up_graphic.visible = false;
    this.fail_graphic = this.add.image(512, 350, "fail");
    this.fail_graphic.visible = false;


    this.health1 = this.add.image(50, 730, "ship")
    this.health1.scale = 0.7;
    this.health2 = this.add.image(100, 730, "ship")
    this.health2.scale = 0.7;
    this.health3 = this.add.image(150, 730, "ship")
    this.health3.scale = 0.7;
    this.health4 = this.add.image(200, 730, "ship")
    this.health4.scale = 0.7;
    this.health5 = this.add.image(250, 730, "ship")
    this.health5.scale = 0.7;

    this.laserGroup = new LaserGroup(this);

    this.enemyGroup = new EnemyGroup(this);
    this.enemyLaserGroup = new EnemyLaserGroup(this);
    
    this.kill_count = this.add.Number;
    this.kill_count = 0;

    this.enemies_remaining = this.add.Number;
    this.enemies_per_wave = this.add.Number;
    this.enemies_per_wave = 14;
    this.enemies_remaining = this.enemies_per_wave;

    this.ship_health = 5;

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;
    this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC");
    this.ship = this.physics.add.image(512, 700, "ship");
    this.ship.body.velocity.x = 0;
    this.ship.body.velocity.y = 0;

    //this.ship.setCollideWorldBounds(true);


    this.debugText = this.add.text(16, 16, "");
    this.scoreText = this.add.text(400, 30, "", {font: "32px"});
    //this.funnyText = this.add.text(0, 400, "y=400:-------------------------------------------------------------------------------------------------------------------")

    // dive bombing code:

    let enemies = this.enemyGroup;

    this.start_countdown = this.add.Number;
    this.start_countdown = 6;

    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {

        if(this.start_countdown != 0){
          this.start_countdown -= 1;
          return;
        }
        // don't want to tell an enemy to divebomb when it is already in the middle of that
        // first, collect all of the enemies that are not currently diving and pick randomly from that
        let availableDivers = [];
        enemies.getChildren().forEach((enemy) => {
	        //console.log(enemy.body.velocity.x);
          if (enemy.active && enemy.getData("diving") !== "true") {
            availableDivers.push(enemy);
          }
	        //console.log(enemy.body.velocity.y);
        });

        // if all enemies are diving, wait for next callback
        if (availableDivers.length == 0) {
          //console.log("all enemies diving, skipping");
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

        var side = Number(diveBomber.x > 512)
        var rot = Number(6*3.2 * Math.pow(-1, side))
        var timepoint = 0;
        var started = 0;
        var start_y = diveBomber.y;
        var start_x = diveBomber.x;
        var stop = 0;
        //console.log("haha" + start_x)
        //console.log("haha" + start_y)
        
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
            //console.log("remmaining " + this.enemies_remaining)
            //frankly idk how time works in this
            timepoint += 30;
            //this system log doesn't work somehow (because it's supposed to be console.log() you dingus)
            //system.log("lol");
            //these rotation lines just doesn't work
            //diveBomber.setRotation(diveBomber.body.rotation + 0.0000000000001);
            //diveBomber.body.rotation += 1
            //diveBomber.setVelocityY((timepoint/2700) * 800 * Math.sin((diveBomber.body.rotation+90)*(Math.PI/180)));
            //console.log("x " + diveBomber.x + " " + start_x);
            //console.log("y " + diveBomber.y + " " + start_y);
            if(started == 1){
              //you CAN'T do it like this!!
              //if((start_y + 100) >= diveBomber.y >= start_y){
              //you HAVE to do it like this
              
              //testing stuff
              if(start_y + 50 >= diveBomber.y && diveBomber.y >= start_y - 50){
                //this is EXACTLY how you freaking do it
                //the velocity refers to the distance you're going to move in the next update (i'm pretty sure)
                
                //this idea might just be flat out wrong
                //diveBomber.y = start_y + diveBomber.body.velocity.y
                diveBomber.setVelocityY(200)
                diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));  
                if((start_x + 10) >= diveBomber.x && diveBomber.x >= start_x){
                  //console.log("yay\n")
                  //i think this idea might just be flat out wrong
                  //diveBomber.x = start_x + diveBomber.body.velocity.x
                  diveBomber.x = start_x
                  diveBomber.setVelocityY(0)
                  diveBomber.setVelocityX(0)
                  diveBomber.setRotation(0)
                  stop = 1
                }
              }
              else{
                diveBomber.setVelocityY(200)
                //diveBomber.setVelocityY(300*Math.sin(((diveBomber.body.rotation+90)/3/*-180*/)*(Math.PI/180)));
                diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));     
              }
              if(diveBomber.y > 800){
                diveBomber.y -= 850
              }
            }
            else{
              diveBomber.setVelocityY(200)
              //diveBomber.setVelocityY(300*Math.sin(((diveBomber.body.rotation+90)/3/*-180*/)*(Math.PI/180)));    
              diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));
              if(diveBomber.y > 800){
                diveBomber.y -= 850
              }     
              if(diveBomber.y > start_y + 30){
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
      
        //console.log("lmao");
        diveBombTimeline.play();
      },
      callbackScope: this
    });


    // add an event for each enemy to shoot between an interval
    this.enemyGroup.getChildren().forEach((enemy) => {
      this.time.addEvent({
        delay: Phaser.Math.FloatBetween(2000, 5000),
        loop: true,
        callback: () => {
          // console.log(`enemy shooting: ${enemy}`);
          if (enemy.active && enemy.y < 400) {
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
  }

  laserCollision(enemy, laser) {

    // disable the enemy and the laser that collided
    enemy.disableBody(true, true);
    laser.disableBody(true, true);
    this.enemies_remaining -= 1;
    this.kill_count += 1;
  }

  enemyLaserCollision(player, enemyLaser) {
    if(this.time_remaining != 0){
      // disable the laser that collided
      this.ship_health -= 1;
      if(this.ship_health == 4){
        this.health5.visible = false
      }
      if(this.ship_health == 3){
        this.health4.visible = false
      }
      if(this.ship_health == 2){
        this.health3.visible = false
      }
      if(this.ship_health == 1){
        this.health2.visible = false
      }
      if(this.ship_health == 0){
        this.health1.visible = false
      }
      enemyLaser.disableBody(true, true);
      if(this.ship_health == 0){
        this.ship.disableBody(true,true);
      }
    }
  }

  playerEnemyBodyCollision(player, enemy) {
    if(this.time_remaining != 0){
      this.ship_health -= 1;
      if(this.ship_health == 4){
        this.health5.visible = false
      }
      if(this.ship_health == 3){
        this.health4.visible = false
      }
      if(this.ship_health == 2){
        this.health3.visible = false
      }
      if(this.ship_health == 1){
        this.health2.visible = false
      }
      if(this.ship_health == 0){
        this.health1.visible = false
      }

      enemy.disableBody(true,true);
      this.enemies_remaining -= 1;
      if(this.ship_health == 0){
        this.ship.disableBody(true,true);
      }
    }
    // console.log("player collided with enemy body");
  }

  update() {
    //if game_start_time is 0 it means the scene has just been created. for some reason it doesn't work
    //properly if i do this in create(), since it gets all weird when you pause or return to the main menu
    if(this.game_start_time == 0){
      this.game_start_time = this.time.now;
    }

    this.time_elapsed = this.time.now - this.time_paused - this.game_start_time;

    if(this.pause_start != this.last_pause_start && !this.scene.isPaused("testScene")){
      console.log("this thing happened");
      this.time_paused += this.time.now - this.pause_start;
      this.last_pause_start = this.pause_start;
      //this.time_remaining += this.time.now - this.pause_start;
      //this.pause_start = 0;
    }

    if(this.ship_health != 0){
      this.time_remaining = Math.max(0, Number(60 - (this.time_elapsed/1000)).toFixed(2));
    }

    if(this.time_remaining != 0){
      this.physics.world.wrap(this.ship);
    }

    if(this.ship_health == 0){
      this.fail_graphic.visible = true;
    }

    if(this.time_remaining < 57){
      this.ready_graphic.visible = false;
      this.fire_graphic.visible = true;
      if(this.time_remaining < 56){
        this.level_graphic.alpha -= 0.01;
        this.fire_graphic.alpha -= 0.01;
        //this.fire_graphic.visible = false;
        if(this.time_remaining == 0){
          this.time_up_graphic.visible = true;
        }
      }
    }

    //this should be zero because then the enemies start to get off-cycle from one another
    //form a huge group on one side of the screen
    if(this.enemies_remaining == 0){
      //this.enemyGroup.destroy();
      //this.enemyLaserGroup.destroy();

      this.enemies_remaining = this.enemies_per_wave;

      this.enemyGroup = new EnemyGroup(this);
      //this.enemyLaserGroup = new EnemyLaserGroup(this);
  
      //this.laserGroup.physicsType = Phaser.Physics.ARCADE;
      this.enemyGroup.physicsType = Phaser.Physics.ARCADE;
  
      //this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC,G");
      //this.ship = this.physics.add.image(512, 700, "ship");
      //this.ship.setCollideWorldBounds(true);
  
      //this.debugText = this.add.text(16, 16, "hello");
  
      // dive bombing code:
  
      let enemies = this.enemyGroup;
      this.time.addEvent({
        delay: 200,
        loop: true,
        callback: () => {
  
          // don't want to tell an enemy to divebomb when it is already in the middle of that
          // first, collect all of the enemies that are not currently diving and pick randomly from that
          let availableDivers = [];
          enemies.getChildren().forEach((enemy) => {
            //console.log(enemy.body.velocity.x);
            if (enemy.active && enemy.getData("diving") !== "true") {
              availableDivers.push(enemy);
            }
            //console.log(enemy.body.velocity.y);
          });
  
          // if all enemies are diving, wait for next callback
          if (availableDivers.length == 0) {
            //console.log("all enemies diving, skipping");
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
  
          var side = Number(diveBomber.x > 512)
          var rot = Number(6*3.2 * Math.pow(-1, side))
          var timepoint = 0;
          var started = 0;
          var start_y = diveBomber.y;
          var start_x = diveBomber.x;
          var stop = 0;
          //console.log("haha" + start_x)
          //console.log("haha" + start_y)
          
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
              //console.log("remmaining " + this.enemies_remaining)
              //frankly idk how time works in this
              timepoint += 30;
              //this system log doesn't work somehow (because it's supposed to be console.log() you dingus)
              //system.log("lol");
              //these rotation lines just doesn't work
              //diveBomber.setRotation(diveBomber.body.rotation + 0.0000000000001);
              //diveBomber.body.rotation += 1
              //diveBomber.setVelocityY((timepoint/2700) * 800 * Math.sin((diveBomber.body.rotation+90)*(Math.PI/180)));
              //console.log("x " + diveBomber.x + " " + start_x);
              //console.log("y " + diveBomber.y + " " + start_y);
              if(started == 1){
                //you CAN'T do it like this!!
                //if((start_y + 100) >= diveBomber.y >= start_y){
                //you HAVE to do it like this
                
                //testing stuff
                if(start_y + 50 >= diveBomber.y && diveBomber.y >= start_y - 50){
                  //this is EXACTLY how you freaking do it
                  //the velocity refers to the distance you're going to move in the next update (i'm pretty sure)
                  
                  //this idea might just be flat out wrong
                  //diveBomber.y = start_y + diveBomber.body.velocity.y
                  diveBomber.setVelocityY(200)
                  diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));  
                  if((start_x + 10) >= diveBomber.x && diveBomber.x >= start_x){
                    //console.log("yay\n")
                    //i think this idea might just be flat out wrong
                    //diveBomber.x = start_x + diveBomber.body.velocity.x
                    diveBomber.x = start_x
                    diveBomber.setVelocityY(0)
                    diveBomber.setVelocityX(0)
                    diveBomber.setRotation(0)
                    stop = 1
                  }
                }
                else{
                  diveBomber.setVelocityY(200)
                  //diveBomber.setVelocityY(300*Math.sin(((diveBomber.body.rotation+90)/3/*-180*/)*(Math.PI/180)));
                  diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));     
                }
                if(diveBomber.y > 800){
                  diveBomber.y -= 850
                }
              }
              else{
                diveBomber.setVelocityY(200)
                //diveBomber.setVelocityY(300*Math.sin(((diveBomber.body.rotation+90)/3/*-180*/)*(Math.PI/180)));    
                diveBomber.setVelocityX(Math.pow(1, side)*300*Math.cos(2*(diveBomber.body.rotation+0)*(Math.PI/180)));
                if(diveBomber.y > 800){
                  diveBomber.y -= 850
                }     
                if(diveBomber.y > start_y + 30){
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
        
          //console.log("lmao");
          diveBombTimeline.play();
        },
        callbackScope: this
      });
  
  
      // add an event for each enemy to shoot between an interval
      this.enemyGroup.getChildren().forEach((enemy) => {
        this.time.addEvent({
          delay: Phaser.Math.FloatBetween(500, 2500),
          loop: true,
          callback: () => {
            // console.log(`enemy shooting: ${enemy}`);
            if (enemy.active && enemy.y < 400) {
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
    }

    this.scoreText.setText("kill count: " + this.kill_count + "\n" +
    "time: " + this.time_remaining + "\n" );
    /*"health: " + this.ship_health + "\n" +
    "time paused: " + this.time_paused + "\n" +
    "start time: " + this.game_start_time + "\n" +
    "this.time.now: " + this.time.now + "\n" + 
    "this.time_elapsed: " + this.time_elapsed/1000);*/

    this.debugText.setText(
      "fps: " +
      Number(this.game.loop.actualFps).toFixed(1).toString() /*+
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

    if(this.time_remaining == 0){
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
        this.ship.setVelocityY(2*(734 - this.ship.y));
      }
      if (this.keys.LEFT.isDown && !this.keys.RIGHT.isDown) {
        if (this.ship.body.velocity.x > 400) {
          this.ship.setTexture("ship");
        } else {
          this.ship.setTexture("ship_left");
        }
        if(this.ship.body.velocity.x >= -700 /*-200*/){
          //this.ship.setVelocityX(this.ship.body.velocity.x - 20);
          this.ship.setVelocityX(this.ship.body.velocity.x + .025 * (-700 - this.ship.body.velocity.x));
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
        if(this.ship.body.velocity.x <= 700 /*200*/){
          //this.ship.setVelocityX(this.ship.body.velocity.x + 20);
          this.ship.setVelocityX(this.ship.body.velocity.x + .025 * (700 - this.ship.body.velocity.x));
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
      if(this.time_remaining < 57){
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
          this.laserGroup.fireLaser(
            this.ship.x + this.ship.body.velocity.x * 0.03,
            this.ship.y - 48,
            this.ship.body.velocity.x,
            this.ship.body.velocity.y
          );
        }
      }
    }
    else if (this.time_remaining != 0) {
      this.ship.setVelocityX(0);
      this.ship.setVelocityY(0);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
      if(!this.scene.isPaused("testScene")){
        console.log("got time");
        this.pause_start = this.time.now;        
      }
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

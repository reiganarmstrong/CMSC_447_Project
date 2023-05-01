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
    this.game_start_time = this.add.Number;
    this.game_start_time = this.time.now;

    this.add.image(512, 384, "sky");
    this.laserGroup = new LaserGroup(this);

    this.enemyGroup = new EnemyGroup(this);
    this.enemyLaserGroup = new EnemyLaserGroup(this);
    
    this.kill_count = this.add.Number;
    this.kill_count = 0;

    this.enemies_remaining = this.add.Number;
    this.enemies_remaining = 5;

    this.laserGroup.physicsType = Phaser.Physics.ARCADE;
    this.enemyGroup.physicsType = Phaser.Physics.ARCADE;

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC,G");
    this.ship = this.physics.add.image(512, 700, "ship");
    //this.ship.setCollideWorldBounds(true);

    this.debugText = this.add.text(16, 16, "hello");
    this.scoreText = this.add.text(512, 100, "kill count: 0", {font: "32px"});

    // dive bombing code:

    let enemies = this.enemyGroup;
    this.time.addEvent({
      //delay: 3000, // every 10 seconds
      delay: 6000,
      loop: true,
      callback: () => {

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

        var side = Number(diveBomber.x > 512)
        var rot = Number(6*3.2 * Math.pow(-1, side))
        var timepoint = 0;
        var started = 0;
        var start_y = diveBomber.y;
        var start_x = diveBomber.x;
        var stop = 0;
        console.log("haha" + start_x)
        console.log("haha" + start_y)
        
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
            console.log("remmaining " + this.enemies_remaining)
            //frankly idk how time works in this
            timepoint += 30;
            //this system log doesn't work somehow (because it's supposed to be console.log() you dingus)
            //system.log("lol");
            //these rotation lines just doesn't work
            //diveBomber.setRotation(diveBomber.body.rotation + 0.0000000000001);
            //diveBomber.body.rotation += 1
            //diveBomber.setVelocityY((timepoint/2700) * 800 * Math.sin((diveBomber.body.rotation+90)*(Math.PI/180)));
            console.log("x " + diveBomber.x + " " + start_x);
            console.log("y " + diveBomber.y + " " + start_y);
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
                  console.log("yay\n")
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
      
        console.log("lmao");
        diveBombTimeline.play();
      },
      callbackScope: this
    });


    // add an event for each enemy to shoot between an interval
    this.enemyGroup.getChildren().forEach((enemy) => {
      this.time.addEvent({
        delay: Phaser.Math.FloatBetween(3000, 7000),
        loop: true,
        callback: () => {
          // console.log(`enemy shooting: ${enemy}`);
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
    // Idle movement of enemies
    this.enemyGroup.getChildren().forEach((enemy) => {
      let enemyTimelineX = this.tweens.createTimeline();
      enemyTimelineX.add({
        targets: enemy,
        x: "+=40",
        duration: 2000,
        //ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
      });

      enemyTimelinesX.push(enemyTimelineX);

      // the y tween is composed of two smaller tweens:
      // moving down for half the time and moving back up for half the time
      // this creates the semicircle effect
      /*let enemyTimelineY = this.tweens.createTimeline();
      enemyTimelineY.add({
        targets: enemy,
        //y: "+=50",
        duration: 250,
        //ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
        loop: -1
      });
      enemyTimelineY.add({
        targets: enemy,
        //y: "-=50",
        duration: 250,
        //ease: "Sine.InOut",
        yoyo: true,
        repeat: -1,
        loop: -1
      });
      //enemyTimelinesY.push(enemyTimelineY);

      // console.log("added tween");*/
    });

    //enemyTimelinesX.forEach((timeline) => { timeline.play(); });
    //enemyTimelinesY.forEach((timeline) => { timeline.play(); });
  }

  laserCollision(enemy, laser) {

    // disable the enemy and the laser that collided
    enemy.disableBody(true, true);
    laser.disableBody(true, true);
    this.enemies_remaining -= 1;
    this.kill_count += 1;
  }

  enemyLaserCollision(player, enemyLaser) {
    // disable the laser that collided
    enemyLaser.disableBody(true, true);
  }

  playerEnemyBodyCollision(player, enemy) {
    // console.log("player collided with enemy body");
  }

  update() {
    this.physics.world.wrap(this.ship);

    if(this.enemies_remaining == 0){
      //this.enemyGroup.destroy();
      //this.enemyLaserGroup.destroy();

      this.enemies_remaining = 5;

      this.enemyGroup = new EnemyGroup(this);
      this.enemyLaserGroup = new EnemyLaserGroup(this);
  
      //this.laserGroup.physicsType = Phaser.Physics.ARCADE;
      this.enemyGroup.physicsType = Phaser.Physics.ARCADE;
  
      //this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE,ESC,G");
      //this.ship = this.physics.add.image(512, 700, "ship");
      //this.ship.setCollideWorldBounds(true);
  
      //this.debugText = this.add.text(16, 16, "hello");
  
      // dive bombing code:
  
      let enemies = this.enemyGroup;
      this.time.addEvent({
        //delay: 3000, // every 10 seconds
        delay: 6000,
        loop: true,
        callback: () => {
  
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
  
          var side = Number(diveBomber.x > 512)
          var rot = Number(6*3.2 * Math.pow(-1, side))
          var timepoint = 0;
          var started = 0;
          var start_y = diveBomber.y;
          var start_x = diveBomber.x;
          var stop = 0;
          console.log("haha" + start_x)
          console.log("haha" + start_y)
          
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
              console.log("remmaining " + this.enemies_remaining)
              //frankly idk how time works in this
              timepoint += 30;
              //this system log doesn't work somehow (because it's supposed to be console.log() you dingus)
              //system.log("lol");
              //these rotation lines just doesn't work
              //diveBomber.setRotation(diveBomber.body.rotation + 0.0000000000001);
              //diveBomber.body.rotation += 1
              //diveBomber.setVelocityY((timepoint/2700) * 800 * Math.sin((diveBomber.body.rotation+90)*(Math.PI/180)));
              console.log("x " + diveBomber.x + " " + start_x);
              console.log("y " + diveBomber.y + " " + start_y);
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
                    console.log("yay\n")
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
        
          console.log("lmao");
          diveBombTimeline.play();
        },
        callbackScope: this
      });
  
  
      // add an event for each enemy to shoot between an interval
      this.enemyGroup.getChildren().forEach((enemy) => {
        this.time.addEvent({
          delay: Phaser.Math.FloatBetween(3000, 7000),
          loop: true,
          callback: () => {
            // console.log(`enemy shooting: ${enemy}`);
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
      // Idle movement of enemies
      this.enemyGroup.getChildren().forEach((enemy) => {
        let enemyTimelineX = this.tweens.createTimeline();
        enemyTimelineX.add({
          targets: enemy,
          x: "+=40",
          duration: 2000,
          //ease: "Sine.InOut",
          yoyo: true,
          repeat: -1,
        });
  
        enemyTimelinesX.push(enemyTimelineX);
  
        // the y tween is composed of two smaller tweens:
        // moving down for half the time and moving back up for half the time
        // this creates the semicircle effect
        /*let enemyTimelineY = this.tweens.createTimeline();
        enemyTimelineY.add({
          targets: enemy,
          //y: "+=50",
          duration: 250,
          //ease: "Sine.InOut",
          yoyo: true,
          repeat: -1,
          loop: -1
        });
        enemyTimelineY.add({
          targets: enemy,
          //y: "-=50",
          duration: 250,
          //ease: "Sine.InOut",
          yoyo: true,
          repeat: -1,
          loop: -1
        });
        //enemyTimelinesY.push(enemyTimelineY);
  
        // console.log("added tween");*/
      });
  
      //enemyTimelinesX.forEach((timeline) => { timeline.play(); });
      //enemyTimelinesY.forEach((timeline) => { timeline.play(); });
    }

    this.scoreText.setText("kill count: " + this.kill_count + "\n" +
    "time: " + Number((this.time.now - this.game_start_time)/1000).toFixed(2));

    this.debugText.setText(
      "fps: " +
      this.game.loop.actualFps.toString() +
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
      "\n"
    );

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
      this.ship.setVelocityX(this.ship.body.velocity.x - 12);
      //this.ship.body.rotation -= 2;
    }
    if (this.keys.RIGHT.isDown && !this.keys.LEFT.isDown) {
      if (this.ship.body.velocity.x < -400) {
        this.ship.setTexture("ship");
      } else {
        this.ship.setTexture("ship_right");
      }
      this.ship.setVelocityX(this.ship.body.velocity.x + 12);
      //this.ship.body.rotation += 2;
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
    if (this.keys.G.isDown) {
      this.ship.body.rotation += 2;
    }
  }
}

export default testScene;

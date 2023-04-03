import { Scene } from "phaser";
import LaserGroup from "./helperClasses/LaserGroup";
class testScene extends Scene {
  init() {}
  preload() {
    // must load from webserver (even if localhost) instead of from a local file
    // due to security reasons
    this.load.image("ship", "assets/png/ship.png");
    this.load.image("missile", "assets/png/missile.png");
    this.load.setCORS("Access-Control-Allow-Origin: http://labs.phaser.io");
    this.load.image("sky", "http://labs.phaser.io/assets/skies/space3.png");
    this.load.image(
      "logo",
      "http://labs.phaser.io/assets/sprites/phaser3-logo.png"
    );
    this.load.image("red", "http://labs.phaser.io/assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    this.laserGroup = new LaserGroup(this);

    this.keys = this.input.keyboard.addKeys("LEFT,RIGHT,UP,DOWN,SPACE");

    let particles = this.add.particles("red");

    let emitter = particles.createEmitter({
      speed: 20,
      scale: { start: 0.5, end: 0 },
      lifespan: 400,
      blendMode: "ADD",
    });

    this.ship = this.physics.add.image(300, 700, "ship");
    this.ship.setCollideWorldBounds(true);

    // var logo = this.physics.add.image(400, 100, 'logo');

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    emitter.startFollow(this.ship);
  }

  update() {
    if (this.keys.UP.isDown) {
      console.log("up");
      this.ship.setPosition(this.ship.x, this.ship.y - 2);
    } else if (this.keys.DOWN.isDown) {
      console.log("down");
      this.ship.setPosition(this.ship.x, this.ship.y + 2);
    }
    if (this.keys.LEFT.isDown) {
      console.log("left");
      this.ship.setPosition(this.ship.x - 2, this.ship.y);
    } else if (this.keys.RIGHT.isDown) {
      console.log("right");
      this.ship.setPosition(this.ship.x + 2, this.ship.y);
    }

    // if (Phaser.Input.Keyboard.JustDown)

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      console.log("shooted");
      this.laserGroup.fireLaser(this.ship.x, this.ship.y - 20);
    }
  }
}

export default testScene;

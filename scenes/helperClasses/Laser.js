import Phaser from "phaser";
class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "missile");
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  fire(x, y, xVel, yVel) {
    // this.body.reset(x, y);
    this.enableBody(true, x, y, true, true);
    this.setActive(true);
    this.setVisible(true);
    this.setCollideWorldBounds(true);
    this.setBounce(true);

    //if the ship doesn't have upwards speed greater
    //than the minimum bullet speed
    if (yVel >= -700) {
      this.setVelocity(xVel, -700);
    }
    else {
      this.setVelocity(xVel, yVel - 100);
    }
  }

}
export default Laser;

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

  fire(x, y) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(0, -90);
  }
}
export default Laser;

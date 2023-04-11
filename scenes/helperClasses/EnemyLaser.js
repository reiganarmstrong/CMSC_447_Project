import Phaser from "phaser";
class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemyLaser");
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y >= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  fire(x, y, xVel, yVel) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);

    //if the ship doesn't have upwards speed greater
    //than the minimum bullet speed
    this.setVelocity(xVel, 700);
  }

}
export default EnemyLaser;

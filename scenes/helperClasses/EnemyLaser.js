import Phaser from "phaser";
class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "enemyLaser");
    console.log(`scene height: ${scene.game.config.height}`)
    this.sceneHeight = scene.game.config.height;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    console.log(`scene height: ${this.sceneHeight}`);
    if (this.y >= this.sceneHeight) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  fire(x, y, xVel, yVel) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);

    this.setVelocity(xVel, yVel);
  }

}
export default EnemyLaser;

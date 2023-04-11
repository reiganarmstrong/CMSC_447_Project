import Phaser from "phaser";
import Laser from "./Laser";
class EnemyLaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    // Call the super constructor, passing in a world and a scene
    super(scene.physics.world, scene);

    // Initialize the group
    this.createMultiple({
      classType: Laser, // This is the class we create just below
      // the below value constrains the maximum number of active objects
      // this determines how many bullets enemies can have on screen at once
      frameQuantity: 10,
      active: false,
      visible: false,
      key: "enemyLaser",
    });
  }

  fireLaser(x, y, xVel, yVel) {
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y, xVel, yVel);
    }
  }
}
export default EnemyLaserGroup;

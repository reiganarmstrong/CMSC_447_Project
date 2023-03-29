import Phaser from "phaser";
import Laser from "./Laser";
class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    // Call the super constructor, passing in a world and a scene
    super(scene.physics.world, scene);

    // Initialize the group
    this.createMultiple({
      classType: Laser, // This is the class we create just below
      // the below value constrains the maximum number of objects on screen at once
      // this determines how many bullets the player can fire before having to wait
      frameQuantity: 15,
      active: false,
      visible: false,
      key: "missile",
    });
  }

  fireLaser(x, y) {
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(x, y);
    }
  }
}
export default LaserGroup;

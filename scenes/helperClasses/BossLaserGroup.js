import Phaser from "phaser";
import BossLaser from "./BossLaser";
class BossLaserGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        // Call the super constructor, passing in a world and a scene
        super(scene.physics.world, scene);

        // Initialize the group
        this.createMultiple({
            classType: BossLaser, // This is the class we create just below
            // the below value constrains the maximum number of active objects
            // this determines how many bullets enemies can have on screen at once
            frameQuantity: 15,
            active: false,
            visible: false,
            key: "bossLaser",
        });
    }

    fireLaser(x, y, xVel, yVel, pathWidth) {
        const laser = this.getFirstDead(false);
        if (laser) {
            laser.fire(x, y, xVel, yVel, pathWidth);
        }
    }
}
export default BossLaserGroup;

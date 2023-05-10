import Phaser from "phaser";
import BossBigLaser from "./BossBigLaser";
class BossBigLaserGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        // Call the super constructor, passing in a world and a scene
        super(scene.physics.world, scene);

        // Initialize the group
        this.createMultiple({
            classType: BossBigLaser, // This is the class we create just below
            // the below value constrains the maximum number of active objects
            // this determines how many bullets enemies can have on screen at once
            frameQuantity: 1,
            active: false,
            visible: false,
            key: "bossBigLaser",
        });
    }

    fireLaser(x, y, xVel, yVel, pathWidth) {
        const laser = this.getFirstDead(false);
        if (laser) {
            console.log("firing laser")
            laser.fire(x, y, xVel, yVel, pathWidth);
        }
    }
}
export default BossBigLaserGroup;

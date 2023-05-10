import Phaser from "phaser";
class BossBigLaser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bossLaserBig");
        // console.log(`scene height: ${scene.game.config.height}`)
        this.sceneHeight = scene.game.config.height;
        this.direction = 1;
        this.velocityX = 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // console.log(`scene height: ${this.sceneHeight}`);
        if (this.y >= this.sceneHeight) {
            this.setActive(false);
            this.setVisible(false);
        }
    }

    update() {
        // ignore changing velocity if laser is not active
        if (!this.active) {
            return;
        }
        // console.log(`velocityX: ${this.velocityX} path width: ${this.pathWidth}`)
        // console.log("checking deviation")
        // console.log(`x position: ${this.x}`)

        if (this.x - this.startX < -this.pathWidth && this.velocityX < 0) {
            // to the left of the starting x position
            // console.log(`this.x: ${this.x}; startX: ${this.startX}; ${this.x - this.startX} < ${-this.pathWidth}`)
            this.velocityX = -this.velocityX;
            this.setVelocityX(this.velocityX);
        }
        else if (this.x - this.startX > this.pathWidth && this.velocityX > 0) {
            // to the right of the starting x position
            // console.log(`this.x: ${this.x}; startX: ${this.startX}; ${this.x - this.startX} > ${this.pathWidth}`)
            this.velocityX = -this.velocityX;
            this.setVelocityX(this.velocityX);
        }

        // console.log(`[end] this.x: ${this.x}`)
    }

    fire(x, y, xVel, yVel, pathWidth) {
        console.log("fired big laser");
        // this.body.reset(x, y);
        this.enableBody(true, x, y, true, true);
        this.setActive(true);
        this.setVisible(true);

        this.startX = x;
        this.startY = y;

        this.pathWidth = pathWidth;

        this.velocityX = xVel;
        this.setVelocity(xVel, yVel);
    }

}
export default BossBigLaser;

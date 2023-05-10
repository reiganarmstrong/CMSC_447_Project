import Phaser from "phaser";
class BossLaser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "enemyLaser");
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
        console.log(`velocityX: ${this.velocityX} path width: ${this.pathWidth}`)
        // console.log("checking deviation")
        // console.log(`x position: ${this.x}`)

        if (this.x - this.startX < -this.pathWidth && this.velocityX < 0) {
            // to the left of the starting x position
            console.log(`this.x: ${this.x}; startX: ${this.startX}; ${this.x - this.startX} < ${-this.pathWidth}`)
            this.velocityX = -this.velocityX;
            this.setVelocityX(this.velocityX);
        }
        else if (this.x - this.startX > this.pathWidth && this.velocityX > 0) {
            // to the right of the starting x position
            console.log(`this.x: ${this.x}; startX: ${this.startX}; ${this.x - this.startX} > ${this.pathWidth}`)
            this.velocityX = -this.velocityX;
            this.setVelocityX(this.velocityX);
        }

        /*
        if (Math.abs(this.x - this.startX) >= this.pathWidth) {
            console.log(`x: ${this.x}; startX: ${this.startX}; abs difference: ${Math.abs(this.x - this.startX)}`)

            console.log(`detected deviation ${this.direction > 0 ? "RIGHT" : "LEFT"} of ${this.x - this.startX} between ${this.x} and ${this.startX}`);
            // this.setX(this.startX + (this.x - 1) * this.direction);
            this.direction = -this.direction;

            // ensure that the bounce does not occur the next update
            // otherwise, the laser will bounce every frame and appear to move straight down
            const newX = this.x + 2 * this.direction;

            console.log(`[1] oldX: ${this.x} newX: ${newX}`)
            this.setX(newX);
            this.x = newX;
            console.log(`[2] this.x: ${this.x} newX: ${newX}`)
            this.velocityX = -this.velocityX;
            this.setVelocityX(this.velocityX);
        }
        */
        // console.log(`xvel: ${this.velocityX}`)
        // this.velocityX += 10 * this.direction;
        // this.setVelocityX(this.velocityX);
        console.log(`[end] this.x: ${this.x}`)
    }

    fire(x, y, xVel, yVel, pathWidth) {
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
export default BossLaser;

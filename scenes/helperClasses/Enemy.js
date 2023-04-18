import Phaser from "phaser";

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "enemy1");
	}

}
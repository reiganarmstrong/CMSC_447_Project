import Phaser from "phaser";
import Enemy from "./Enemy";
class EnemyGroup extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);

		// Initialize the group

		this.createMultiple({
			classType: Enemy,
			frameQuantity: 5,
			setXY: { x: 80, y: 70, stepX: 200, stepY: 0 },
			active: true,
			visible: true,
			key: "enemy1",
		});

		// can do an X pattern easily with y offsets and mirroring
		/*
		this.createMultiple({
			classType: Enemy,
			frameQuantity: 5,
			setXY: { x: 20, y: 20, stepX: 200, stepY: 50 },
			active: true,
			visible: true,
			key: "enemy1",
		});

		this.createMultiple({
			classType: Enemy,
			frameQuantity: 5,
			setXY: { x: 1020, y: 20, stepX: -200, stepY: 50 },
			active: true,
			visible: true,
			key: "enemy1",
		})
		*/
	}

}
export default EnemyGroup;

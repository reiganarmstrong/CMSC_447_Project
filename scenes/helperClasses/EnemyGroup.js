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
			//setXY: { x: 80, y: 70, stepX: 200, stepY: 0 },
			setXY: { x: 200, y: 70, stepX: 160, stepY: 0 },
			active: true,
			visible: true,
			key: "enemy1",
		});

		this.createMultiple({
			classType: Enemy,
			frameQuantity: 4,
			//setXY: { x: 80, y: 70, stepX: 200, stepY: 0 },
			setXY: { x: 280, y: 140, stepX: 160, stepY: 0 },
			active: true,
			visible: true,
			key: "enemy1",
		});

	}

}
export default EnemyGroup;

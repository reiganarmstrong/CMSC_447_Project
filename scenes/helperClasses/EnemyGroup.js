import Phaser from "phaser";
import Enemy from "./Enemy";
class EnemyGroup extends Phaser.Physics.Arcade.Group {
	constructor(scene, scene_key) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);

		// Initialize the group

		if(scene_key == "levelOneScene"){
			this.createMultiple({
				classType: Enemy,
				frameQuantity: 5,
				setXY: { x: 200, y: 70, stepX: 160, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});
	
			this.createMultiple({
				classType: Enemy,
				frameQuantity: 4,
				setXY: { x: 280, y: 140, stepX: 160, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});

			this.createMultiple({
				classType: Enemy,
				frameQuantity: 5,
				setXY: { x: 200, y: 210, stepX: 160, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});
		}

		else if(scene_key == "levelTwoScene"){
			this.createMultiple({
				classType: Enemy,
				frameQuantity: 5,
				setXY: { x: 200, y: 70, stepX: 160, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});
	
			this.createMultiple({
				classType: Enemy,
				frameQuantity: 5,
				setXY: { x: 120, y: 140, stepX: 200, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});
	
			this.createMultiple({
				classType: Enemy,
				frameQuantity: 5,
				setXY: { x: 200, y: 210, stepX: 160, stepY: 0 },
				active: true,
				visible: true,
				key: "enemy1",
			});
		}
	}

}
export default EnemyGroup;

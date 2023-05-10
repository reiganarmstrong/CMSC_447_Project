import Phaser from "phaser";
class HeartGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    // Call the super constructor, passing in a world and a scene
    super(scene.physics.world, scene);

    // Initialize the group

    this.createMultiple({
      //   classType: Heart,
      frameQuantity: 7,
      //setXY: { x: 80, y: 70, stepX: 200, stepY: 0 },
      setXY: { x: 50, y: 730, stepX: 50, stepY: 0 },
      active: false,
      visible: false,
      key: "ship",
      setScale: { x: 0.5, y: 0.5 },
    });
  }
}
export default HeartGroup;

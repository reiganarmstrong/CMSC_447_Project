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
      setXY: { x: 30, y: 100, stepX: 30, stepY: 0 },
      active: false,
      visible: false,
      key: "heart",
    });
  }
}
export default HeartGroup;

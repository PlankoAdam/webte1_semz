import * as pixi from "pixi.js";
import SpaceCat from "../SpaceCat";

export default class CatOne extends SpaceCat {
  constructor(
    relativeInitPos,
    initRadius,
    endRadius,
    moveDirection,
    orbitDirection
  ) {
    super(
      relativeInitPos,
      initRadius,
      endRadius,
      0.001,
      moveDirection,
      5,
      orbitDirection,
      true,
      1000
    );

    this.sprite = pixi.Sprite.from("src/assets/cat1.png");
    this.addChild(this.sprite);
    this.sprite.anchor.set(0.45, 0.4);
    this.sprite.scale.set(this.radius / 150);
  }

  grow(delta) {
    super.grow(delta);
    this.sprite.scale.set(this.radius / 150);
  }
}

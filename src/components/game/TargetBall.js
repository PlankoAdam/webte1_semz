import * as PIXI from "pixi.js";

export default class TargetBall extends PIXI.Graphics {
  constructor(initRadius, maxRadius, growthRate) {
    super().beginFill(0xffff00).drawCircle(0, 0, initRadius).endFill();
    this.initRadius = initRadius;
    this.maxRadius = maxRadius;
    this.growthRate = growthRate;
    this.radius = initRadius;
  }

  setPos(x, y) {
    this.position.set(x, y);
  }

  setRandPos() {
    this.setPos(
      this.radius +
        Math.random() * (this.parent.hitArea.width - 2 * this.radius),
      this.radius +
        Math.random() * (this.parent.hitArea.height - 2 * this.radius)
    );
  }

  grow(delta) {
    if (this.width <= this.maxRadius) {
      this.width += this.width * this.growthRate * delta;
      this.height += this.height * this.growthRate * delta;
    }
  }

  resetRadius(radius) {
    this.width = 2 * this.initRadius;
    this.height = 2 * this.initRadius;
  }
}

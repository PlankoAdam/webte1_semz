import * as pixi from "pixi.js";

export default class TargetBall extends pixi.Graphics {
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
    if (this.radius <= this.maxRadius) {
      this.radius += this.radius * this.growthRate * delta;
      this.width = this.radius;
      this.height = this.radius;
    }
  }

  resetRadius(radius) {
    this.radius = 2 * this.initRadius;
    this.width = this.radius;
    this.height = this.radius;
  }
}

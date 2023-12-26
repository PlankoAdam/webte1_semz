import * as pixi from "pixi.js";
import { normalize2DVect } from "./utils";

export default class TargetBall extends pixi.Graphics {
  constructor(
    initRadius,
    minRadius,
    maxRadius,
    growthRate,
    moveDirection,
    moveSpeed
  ) {
    super().beginFill(0xffff00).drawCircle(0, 0, initRadius).endFill();
    this.initRadius = initRadius;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.growthRate = growthRate;
    this.radius = initRadius;
    this.moveDirection = normalize2DVect(moveDirection);
    this.moveSpeed = moveSpeed;
    this.doGrow = true;
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
    if (this.doGrow) {
      if (this.radius <= this.maxRadius && this.radius >= this.minRadius) {
        this.radius += this.radius * this.growthRate * delta;
        this.width = 2 * this.radius;
        this.height = 2 * this.radius;
      }
    }
  }

  resetRadius() {
    this.radius = this.initRadius;
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
    this.doGrow = true;
  }

  move(delta) {
    if (
      this.radius + this.x < this.parent.hitArea.width &&
      this.radius + this.y < this.parent.hitArea.height &&
      this.x - this.radius > 0 &&
      this.y - this.radius > 0
    ) {
      this.x += this.moveDirection.x * this.moveSpeed * delta;
      this.y += this.moveDirection.y * this.moveSpeed * delta;
    } else {
      this.doGrow = false;
    }
  }

  setRandDir() {
    this.moveDirection = normalize2DVect({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
    });
  }
}

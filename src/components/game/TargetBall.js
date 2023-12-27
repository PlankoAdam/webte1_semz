import * as pixi from "pixi.js";
import { normalize2DVect } from "./utils";
import * as color from "./colors.json";

export default class TargetBall extends pixi.Graphics {
  constructor(
    initRadius,
    minRadius,
    maxRadius,
    growthRate,
    moveDirection,
    moveSpeed
  ) {
    super();
    this.initRadius = Number(initRadius);
    this.minRadius = Number(minRadius);
    this.maxRadius = Number(maxRadius);
    this.growthRate = Number(growthRate);
    this.radius = this.initRadius;
    if (moveDirection == 0) {
      this.moveDirection = { x: 0, y: 0 };
    } else {
      this.moveDirection = normalize2DVect(moveDirection);
    }
    this.moveSpeed = Number(moveSpeed);
    this.doGrow = true;
    this.flag = 1;
  }

  show() {
    this.beginFill(color.target).drawCircle(0, 0, this.initRadius).endFill();
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
      this.x += this.moveDirection.x * this.moveSpeed * delta * this.flag;
      this.y += this.moveDirection.y * this.moveSpeed * delta * this.flag;
    } else {
      // this.doGrow = false;
      if (this.flag == 1) {
        this.flag = -1;
      } else {
        this.flag = 1;
      }
      this.x += this.moveDirection.x * this.moveSpeed * delta * this.flag;
      this.y += this.moveDirection.y * this.moveSpeed * delta * this.flag;
      this.setRandDir();
    }
  }

  respawn() {
    this.setRandPos();
    this.resetRadius();
  }

  setRandDir() {
    this.moveDirection = normalize2DVect({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
    });
  }
}

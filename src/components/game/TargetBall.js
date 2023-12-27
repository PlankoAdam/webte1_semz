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
  }

  show() {
    this.beginFill(color.target).drawCircle(0, 0, this.initRadius).endFill();
    this.score = 1000;
    this.scoreIntervalID = setInterval(() => {
      this.score = Math.floor(this.score * 0.95);
      if (this.score <= 1) {
        clearInterval(this.scoreIntervalID);
        this.score = 1;
      }
    }, 50);
  }

  pop() {
    clearInterval(this.scoreIntervalID);
    this.clear();
    return this.score;
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
    if (this.radius <= this.maxRadius && this.radius >= this.minRadius) {
      this.radius += this.radius * this.growthRate * delta;
      this.width = 2 * this.radius;
      this.height = 2 * this.radius;
    }
  }

  resetRadius() {
    this.radius = this.initRadius;
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
  }

  move(delta) {
    const newX = this.x + this.moveDirection.x * this.moveSpeed * delta;
    const newY = this.y + this.moveDirection.y * this.moveSpeed * delta;
    if (
      newX + this.radius < this.parent.hitArea.width &&
      newX - this.radius > 0
    ) {
      this.x = newX;
    } else {
      this.moveDirection.x =
        -this.moveDirection.x +
        ((Math.random() - 0.5) * Math.abs(this.moveDirection.x)) / 2;
      this.moveDirection = normalize2DVect(this.moveDirection);
    }

    if (
      newY + this.radius < this.parent.hitArea.height &&
      newY - this.radius > 0
    ) {
      this.y = newY;
    } else {
      this.moveDirection.y =
        -this.moveDirection.y +
        ((Math.random() - 0.5) * Math.abs(this.moveDirection.y)) / 2;
      this.moveDirection = normalize2DVect(this.moveDirection);
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

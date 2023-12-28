import * as pixi from "pixi.js";
import { normalize2DVect } from "./utils";
import * as color from "./colors.json";

export default class TargetBall extends pixi.Graphics {
  constructor(
    relativeInitPos,
    initRadius,
    minRadius,
    maxRadius,
    growthRate,
    moveDirection,
    moveSpeed,
    //if == 0 -> doesn't orbit
    //if > 0  -> orbits clock-wise
    //if < 0  -> orbits counter clock-wise
    orbitDirection,
    isBouncy
  ) {
    super();
    this.relativeInitPos = relativeInitPos;
    this.initRadius = initRadius;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.growthRate = growthRate;
    this.radius = this.initRadius;
    if (moveDirection == 0) {
      this.moveDirection = { x: 0, y: 0 };
    } else {
      this.moveDirection = normalize2DVect(moveDirection);
    }
    this.moveSpeed = moveSpeed;
    this.orbitDirection = orbitDirection;
    this.isBouncy = isBouncy;
    this.score = 1000;
    this.isActive = false;
  }

  show() {
    this.beginFill("000000", 0.0001)
      .drawCircle(0, 0, this.initRadius)
      .endFill();
    this.setPos(
      (this.relativeInitPos.x * this.parent.hitArea.width) / 2 +
        this.parent.hitArea.width / 2,

      (this.relativeInitPos.y * this.parent.hitArea.height) / 2 +
        this.parent.hitArea.height / 2
    );
    this.scoreIntervalID = setInterval(() => {
      this.score = Math.floor(this.score * 0.95);
      if (this.score <= 1) {
        clearInterval(this.scoreIntervalID);
        this.score = 1;
      }
    }, 50);
    this.isActive = true;
  }

  pop() {
    clearInterval(this.scoreIntervalID);
    this.clear();
    this.isActive = false;
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

    //Prevent clipping out of boundaries when growing
    //(Mainly when sliding along the edge)
    this.setPos(
      this.x < this.radius ? this.radius : this.x,
      this.y < this.radius ? this.radius : this.y
    );
    this.setPos(
      this.x > this.parent.hitArea.width - this.radius
        ? this.parent.hitArea.width - this.radius
        : this.x,
      this.y > this.parent.hitArea.height - this.radius
        ? this.parent.hitArea.height - this.radius
        : this.y
    );
  }

  resetRadius() {
    this.radius = this.initRadius;
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
  }

  move(delta) {
    if (this.orbitDirection !== 0) {
      this.updateOrbitDirection({
        x: this.parent.hitArea.width / 2,
        y: this.parent.hitArea.height / 2,
      });
    }
    const newX = this.x + this.moveDirection.x * this.moveSpeed * delta;
    const newY = this.y + this.moveDirection.y * this.moveSpeed * delta;
    if (
      (newX + this.radius < this.parent.hitArea.width &&
        newX - this.radius > 0) ||
      !this.isBouncy
    ) {
      this.x = newX;
    } else if (this.isBouncy) {
      this.moveDirection.x =
        -this.moveDirection.x +
        ((Math.random() - 0.5) * Math.abs(this.moveDirection.x)) / 2;
      this.moveDirection = normalize2DVect(this.moveDirection);
    }

    if (
      (newY + this.radius < this.parent.hitArea.height &&
        newY - this.radius > 0) ||
      !this.isBouncy
    ) {
      this.y = newY;
    } else if (this.isBouncy) {
      this.moveDirection.y =
        -this.moveDirection.y +
        ((Math.random() - 0.5) * Math.abs(this.moveDirection.y)) / 2;
      this.moveDirection = normalize2DVect(this.moveDirection);
    }
  }

  updateOrbitDirection(orbitCenter) {
    const vectToCenter = {
      x: orbitCenter.x - this.x,
      y: orbitCenter.y - this.y,
    };
    this.moveDirection = normalize2DVect({
      x: this.orbitDirection * vectToCenter.y,
      y: -this.orbitDirection * vectToCenter.x,
    });
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

import HitBall from "./HitBall.js";
import * as pixi from "pixi.js";

export default class Asteroid extends HitBall {
  constructor(relativeInitPos, radius, moveDirection, moveSpeed) {
    super(
      relativeInitPos,
      radius,
      radius,
      radius,
      0,
      moveDirection,
      moveSpeed,
      0,
      false
    );
    this.sprite = pixi.Sprite.from("src/assets/asteroid.png");
    this.addChild(this.sprite);
    this.sprite.anchor.set(0.037, 0.5);
    this.sprite.scale.set(this.radius / 40);
    setInterval(() => {
      this.sprite.scale.set(this.sprite.scale.x, -this.sprite.scale.y);
    }, 150 + Math.random() * 50);
    setInterval(() => {
      this.alpha = 1 - Math.random() * 0.08;
    }, 100);
    this.rotate();
  }

  move(delta) {
    super.move(delta);
    this.rotate();
  }

  rotate() {
    this.sprite.rotation =
      Math.atan2(this.moveDirection.y, this.moveDirection.x) - Math.PI;
  }

  grow() {
    return;
  }

  pop() {
    return -1000;
  }
}

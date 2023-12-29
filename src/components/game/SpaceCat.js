import * as pixi from "pixi.js";
import TargetBall from "./TargetBall";

export default class SpaceCat extends TargetBall {
  constructor(
    relativeInitPos,
    initRadius,
    endRadius,
    growthRate,
    moveDirection,
    moveSpeed,
    orbitDirection,
    isBouncy,
    score
  ) {
    if (endRadius >= initRadius) {
      super(
        relativeInitPos,
        initRadius,
        initRadius,
        endRadius,
        growthRate,
        moveDirection,
        moveSpeed,
        orbitDirection,
        isBouncy
      );
    } else {
      super(
        relativeInitPos,
        initRadius,
        endRadius,
        initRadius,
        1 - growthRate,
        moveDirection,
        moveSpeed,
        orbitDirection,
        isBouncy
      );
    }

    this.score = score;
    this.scoreIntervalID = 0;
    this.spinRate = Math.random() - 0.5;
  }

  show() {
    super.show();
    const startScore = this.score;
    this.scoreIntervalID = setInterval(() => {
      this.score -= startScore / 1000;
      if (this.score <= 1) {
        clearInterval(this.scoreIntervalID);
        this.score = 1;
      }
    }, 5);
  }

  move(delta) {
    super.move(delta);
    this.sprite.rotation += (this.spinRate * delta) / 100;
  }

  pop() {
    this.sprite.destroy();
    clearInterval(this.scoreIntervalID);
    super.pop();
    return this.score;
  }
}

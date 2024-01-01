import HitBall from "./HitBall.js";

export default class SpaceCat extends HitBall {
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
    this.startScore = score;
    this.scoreIntervalID = 0;
    this.spinRate = Math.random() - 0.5;

    this.isGold = false;
  }

  animate(delta) {
    this.move(delta);
    this.grow(delta);
  }

  show() {
    super.show();
    this.score = this.startScore;
    this.scoreIntervalID = setInterval(() => {
      this.score -= Math.floor(this.startScore / 1000);
      if (this.score <= this.startScore / 10) {
        clearInterval(this.scoreIntervalID);
        this.score = Math.floor(this.startScore / 10);
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

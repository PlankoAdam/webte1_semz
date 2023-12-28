import TargetBall from "./TargetBall";

export default class GameLevel {
  constructor(levelData) {
    this.scoreGoal = levelData.scoreGoal;
    this.timeLimitSec = levelData.timeLimitSec;
    this.minIntervalms = levelData.minIntervalms;
    this.maxIntervalms = levelData.maxIntervalms;
    this.targetBallsData = levelData.targetBallsData;

    this.score = 0;
    this.targetBalls = [];
    this.initBalls();
  }

  initBalls() {
    for (const data of this.targetBallsData) {
      const newBall = new TargetBall(
        data.relativeInitPos,
        data.initRadius,
        data.minRadius,
        data.maxRadius,
        data.growthRate,
        data.moveDirection,
        data.moveSpeed,
        data.orbitDirection
      );
      this.targetBalls.push(newBall);
    }
  }

  start(app) {
    let totalInterval = 0;
    for (const ball of this.targetBalls) {
      app.stage.addChild(ball);
      setTimeout(() => {
        ball.show();
      }, totalInterval);
      totalInterval +=
        Math.random() * (this.maxIntervalms - this.minIntervalms) +
        this.minIntervalms;
    }
  }
}

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
    let totalInterval = 0;
    for (const data of this.targetBallsData) {
      const newBall = new TargetBall(
        data.initX,
        data.initY,
        data.initRadius,
        data.minRadius,
        data.maxRadius,
        data.growthRate,
        data.moveDirection,
        data.moveSpeed
      );
      this.targetBalls.push(newBall);
      setTimeout(() => {
        newBall.show();
      }, totalInterval);
      totalInterval +=
        Math.random() * (this.maxIntervalms - this.minIntervalms) +
        this.minIntervalms;
    }
  }
}

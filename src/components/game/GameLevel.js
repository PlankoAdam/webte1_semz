import Asteroid from "./Asteroid.js";
import * as cat from "./cats.js";

export default class GameLevel {
  constructor(levelData) {
    this.scoreGoal = levelData.scoreGoal;
    this.timeLimitSec = levelData.timeLimitSec;
    this.minIntervalms = levelData.minIntervalms;
    this.maxIntervalms = levelData.maxIntervalms;

    this.score = 0;
    this.asteroids = [];
    this.cats = [];
    // this.initBalls();

    for (const data of levelData.asteroids) {
      this.asteroids.push(
        new Asteroid(
          data.relativeInitPos,
          data.radius,
          data.moveDirection,
          data.moveSpeed
        )
      );
    }

    for (const data of levelData.cats) {
      let newCat;
      switch (data.type) {
        case "one":
          newCat = new cat.CatOne(data);
          break;
        case "two":
          newCat = new cat.CatTwo(data);
          break;
        case "gold":
          newCat = new cat.GoldCat(data);
          break;
        default:
          newCat = new cat.CatOne(data);
          break;
      }
      this.cats.push(newCat);
    }
  }

  start(app) {
    let totalInterval = 0;
    let allTargets = this.asteroids.concat(this.cats);
    allTargets = allTargets.sort((a, b) => {
      return 0.5 - Math.random();
    });
    for (const target of allTargets) {
      setTimeout(() => {
        app.stage.addChild(target);
        target.show();
      }, totalInterval);
      totalInterval +=
        Math.random() * (this.maxIntervalms - this.minIntervalms) +
        this.minIntervalms;
    }
  }
}

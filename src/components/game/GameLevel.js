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
    this.timeouts = [];
  }

  start(app) {
    let totalInterval = 0;
    let allTargets = this.asteroids.concat(this.cats);
    allTargets = allTargets.sort((a, b) => {
      return 0.5 - Math.random();
    });
    for (const target of allTargets) {
      app.stage.addChild(target);
      this.timeouts.push(
        setTimeout(() => {
          target.show();
        }, totalInterval)
      );
      totalInterval +=
        Math.random() * (this.maxIntervalms - this.minIntervalms) +
        this.minIntervalms;
    }
  }

  stop(app) {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    for (const ast of this.asteroids) {
      app.stage.removeChild(ast);
      if (ast.isActive) {
        ast.pop();
      }
    }
    for (const cat of this.cats) {
      app.stage.removeChild(cat);
      if (cat.isActive) {
        cat.pop();
      }
    }
  }
}

import Asteroid from "./Asteroid.js";
import * as cat from "./cats.js";

export default class GameLevel {
  constructor(levelData) {
    this.timeLimitSec = levelData.timeLimitSec;
    this.minIntervalms = levelData.minIntervalms;
    this.maxIntervalms = levelData.maxIntervalms;

    this.score = 0;
    this.asteroids = [];
    this.cats = [];
    this.goldCats = [];

    for (const data of levelData.asteroids) {
      const newAst = new Asteroid(
        data.relativeInitPos,
        data.radius,
        data.moveDirection,
        data.moveSpeed
      );
      newAst.delay = data.delay;
      this.asteroids.push(newAst);
    }

    for (const data of levelData.cats) {
      let newCat;
      switch (data.type) {
        case "two":
          newCat = new cat.CatTwo(data);
          newCat.delay = data.delay;
          this.cats.push(newCat);
          break;
        case "gold":
          newCat = new cat.GoldCat(data);
          newCat.delay = data.delay;
          this.goldCats.push(newCat);
          break;
        default:
          newCat = new cat.CatOne(data);
          newCat.delay = data.delay;
          this.cats.push(newCat);
          break;
      }
    }
    this.timeouts = [];
  }

  start(app) {
    let allTargets = this.asteroids.concat(this.cats).concat(this.goldCats);
    for (const target of allTargets) {
      app.stage.addChild(target);
      this.timeouts.push(
        setTimeout(() => {
          target.show();
        }, target.delay)
      );
    }
  }

  stop(app) {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    for (const ast of this.asteroids) {
      app.stage.removeChild(ast);
      if (ast.isActive) {
        ast.reset();
      }
    }
    for (const cat of this.cats) {
      app.stage.removeChild(cat);
      if (cat.isActive) {
        cat.pop();
      }
    }

    for (const cat of this.goldCats) {
      app.stage.removeChild(cat);
      if (cat.isActive) {
        cat.pop();
      }
    }
  }
}

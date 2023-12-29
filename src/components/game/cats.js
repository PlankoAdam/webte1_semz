import * as pixi from "pixi.js";
import SpaceCat from "./SpaceCat.js";

export class CatOne extends SpaceCat {
  constructor(opts) {
    super(
      opts.relativeInitPos,
      opts.initRadius,
      opts.endRadius,
      0.001,
      opts.moveDirection,
      5,
      opts.orbitDirection,
      true,
      1000
    );

    this.hitBoxScale = 150;
    this.sprite = pixi.Sprite.from("src/assets/cat1.png");
    this.addChild(this.sprite);
    this.sprite.anchor.set(0.45, 0.4);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }

  grow(delta) {
    super.grow(delta);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }
}

export class CatTwo extends SpaceCat {
  constructor(opts) {
    super(
      opts.relativeInitPos,
      opts.initRadius,
      opts.endRadius,
      0.001,
      opts.moveDirection,
      5,
      opts.orbitDirection,
      true,
      2000
    );

    this.hitBoxScale = 130;
    this.sprite = pixi.Sprite.from("src/assets/cat3.png");
    this.addChild(this.sprite);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }

  grow(delta) {
    super.grow(delta);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }
}

export class GoldCat extends SpaceCat {
  constructor(opts) {
    super(
      opts.relativeInitPos,
      opts.initRadius,
      opts.endRadius,
      0.001,
      opts.moveDirection,
      5,
      opts.orbitDirection,
      false,
      10000
    );

    this.hitBoxScale = 130;
    this.sprite = pixi.Sprite.from("src/assets/goldcat.png");
    this.addChild(this.sprite);
    this.sprite.anchor.set(0.42, 0.5);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }

  grow(delta) {
    super.grow(delta);
    this.sprite.scale.set(this.radius / this.hitBoxScale);
  }
}

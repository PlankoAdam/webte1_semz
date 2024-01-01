import * as pixi from "pixi.js";
import { distance } from "./utils.js";
import * as color from "./colors.json";

export default class Player extends pixi.Graphics {
  constructor(moveSpeed, initX, initY) {
    super()
      .beginFill(color.player)
      .drawPolygon(0, -25, 15, 25, 0, 15, -15, 25)
      .endFill();
    this.moveSpeed = moveSpeed;
    this.acceleration = { x: 0, y: 0 };
    this.setPos(initX, initY);

    this.history = [];
    this.historySize = 30;
    for (let i = 0; i < this.historySize; i++) {
      this.history.push({ x: initX, y: initY });
    }
    this.trail = new pixi.SimpleRope(
      pixi.Texture.from("game-assets/trail.png"),
      this.history
    );

    this.isVulnerable = true;
    this.flashIntervalID;
  }

  setPos(x, y) {
    this.position.set(x, y);
  }

  followPointer(pointerCoords, timeDelta) {
    const screenWidth = this.parent.hitArea.width;
    const screenHeight = this.parent.hitArea.height;
    if (
      screenWidth > pointerCoords.x ||
      pointerCoords.x > 0 ||
      screenHeight > pointerCoords.y ||
      pointerCoords.y > 0
    ) {
      const toMouseDirection = {
        x: pointerCoords.x - this.x,
        y: pointerCoords.y - this.y,
      };

      const angleToMouse = Math.atan2(toMouseDirection.x, toMouseDirection.y);
      const dist = distance(pointerCoords, this.position);
      const playerSpeed = dist * this.moveSpeed;

      const rotationAngle =
        Math.atan2(toMouseDirection.y, toMouseDirection.x) + Math.PI / 2;
      this.rotation = rotationAngle;

      this.acceleration = {
        x: Math.sin(angleToMouse) * playerSpeed,
        y: Math.cos(angleToMouse) * playerSpeed,
      };
    }

    this.x += this.acceleration.x * timeDelta;
    this.y += this.acceleration.y * timeDelta;

    this.updateTrail();
  }

  updateTrail() {
    this.history.push({
      x: this.x,
      y: this.y,
    });
    this.history.splice(0, 1);
  }

  damage() {
    this.isVulnerable = false;
    this.flashIntervalID = setInterval(() => {
      this.alpha = this.alpha == 1 ? 0 : 1;
      this.trail.alpha = this.alpha;
    }, 100);
    setTimeout(() => {
      clearInterval(this.flashIntervalID);
      this.alpha = 1;
      this.trail.alpha = 1;
      this.isVulnerable = true;
    }, 2000);
  }
}

import * as pixi from "pixi.js";
import { distance } from "./utils.js";
import * as color from "./colors.json";

export default class Player extends pixi.Graphics {
  constructor(moveSpeed) {
    super()
      .beginFill(color.playerColor)
      .drawPolygon(0, 0, 15, 50, 0, 40, -15, 50)
      .endFill();
    this.moveSpeed = moveSpeed;
    this.acceleration = { x: 0, y: 0 };
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

      const rotatationAngle =
        Math.atan2(toMouseDirection.y, toMouseDirection.x) + Math.PI / 2;
      this.rotation = rotatationAngle;

      this.acceleration = {
        x: Math.sin(angleToMouse) * playerSpeed,
        y: Math.cos(angleToMouse) * playerSpeed,
      };
    }

    this.x += this.acceleration.x * timeDelta;
    this.y += this.acceleration.y * timeDelta;
  }
}

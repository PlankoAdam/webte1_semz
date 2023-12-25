<template>
  <div ref="gameWindow"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
import TargetBall from "./game/TargetBall.js";
import Player from "./game/Player.js";

let gameWindow = ref(null);

const gameWidth = 900;
const gameHeight = 700;

let mouseCoords = { x: gameWidth / 2.0, y: gameHeight / 2.0 };
let app = new PIXI.Application({
  width: gameWidth,
  height: gameHeight,
  antialias: true,
});
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("mousemove", (e) => {
  mouseCoords.x = e.global.x;
  mouseCoords.y = e.global.y;
});

const player = new Player(0.15);
app.stage.addChild(player);
player.setPos(app.screen.width / 2, app.screen.height / 2);

const ball = new TargetBall(15, 100, 0.02);
app.stage.addChild(ball);
ball.setRandPos();

app.ticker.add((delta) => {
  // if (
  //   app.screen.width > mouseCoords.x ||
  //   mouseCoords.x > 0 ||
  //   app.screen.height > mouseCoords.y ||
  //   mouseCoords.y > 0
  // ) {
  //   const toMouseDirection = new PIXI.Point(
  //     mouseCoords.x - player.x,
  //     mouseCoords.y - player.y
  //   );

  //   const angleToMouse = Math.atan2(toMouseDirection.x, toMouseDirection.y);
  //   const dist = distance(mouseCoords, player.position);
  //   const playerSpeed = dist * moveSpeed;

  //   const rotatationAngle =
  //     Math.atan2(toMouseDirection.y, toMouseDirection.x) + Math.PI / 2;
  //   player.rotation = rotatationAngle;

  //   player.acceleration.set(
  //     Math.sin(angleToMouse) * playerSpeed,
  //     Math.cos(angleToMouse) * playerSpeed
  //   );
  // }

  // player.x += player.acceleration.x * delta;
  // player.y += player.acceleration.y * delta;

  player.followPointer(mouseCoords, delta);

  ball.grow(delta);
  if (ball.containsPoint(player.position)) {
    ball.setRandPos();
    ball.resetRadius();
  }
});

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

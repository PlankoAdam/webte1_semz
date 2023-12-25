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

let mouseCoords = { x: gameWidth / 2, y: gameHeight / 2 };

//Init PIXI app
let app = new PIXI.Application({
  width: gameWidth,
  height: gameHeight,
  antialias: true,
});

//Set up mouse listener inside game area
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("mousemove", (e) => {
  mouseCoords.x = e.global.x;
  mouseCoords.y = e.global.y;
});

//Player object
const player = new Player(0.15);
app.stage.addChild(player);
player.setPos(mouseCoords.x, mouseCoords.y);

const ball = new TargetBall(15, 100, 0.02);
app.stage.addChild(ball);
ball.setRandPos();

//Game loop
app.ticker.add((delta) => {
  player.followPointer(mouseCoords, delta);

  ball.grow(delta);
  //If player object touches the ball
  if (ball.containsPoint(player.position)) {
    ball.setRandPos();
    ball.resetRadius();
  }
});

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

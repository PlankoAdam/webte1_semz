<template>
  <div class="flex flex-col">
    <div class="flex-row absolute top-0 left-0 w-full my-3">
      <div class="flex justify-between w-full">
        <h1 class="py-0 my-0 text-start text-6xl font-thin">
          LEVEL: {{ levelCount }}
        </h1>
        <div class="flex justify-center">
          <h1 class="py-0 my-0 text-6xl font-thin">SCORE: {{ scoreCount }}</h1>
        </div>
      </div>
    </div>
    <div ref="gameWindow"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
import TargetBall from "./game/TargetBall.js";
import Player from "./game/Player.js";
import GameLevel from "./game/GameLevel";
import * as color from "./game/colors.json";
import levelsData from "./game/levels.json";

let gameWindow = ref(null);
let scoreCount = ref(0);
let levelCount = ref(1);

//Size of game area
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
window.onResize = () => {
  gameWidth = window.innerWidth;
  gameHeight = window.innerHeight;
};

let mouseCoords = { x: gameWidth / 2, y: gameHeight / 2 };

//Init PIXI app
let app = new PIXI.Application({
  width: gameWidth,
  height: gameHeight,
  antialias: true,
  background: color.background,
  resizeTo: window,
});

//DESKTOP CONTROLS
//Set up mouse listener inside game area
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("mousemove", (e) => {
  mouseCoords.x = e.global.x;
  mouseCoords.y = e.global.y;
});

//MOBILE CONTROLS
//Add listener for change in device orientation on mobile devices
//Two types of controls available on mobile (comment out the unused one)

////Centered controls BEGIN
// const centereCtrlsMultiX = 7;
// const centereCtrlsMultiY = 10;
// if (window.DeviceOrientationEvent) {
//   window.addEventListener("deviceorientation", (e) => {
//     const newX =
//       centereCtrlsMultiX * (e.gamma / 180) * (gameWidth / 2) + gameWidth / 2;
//     const newY =
//       centereCtrlsMultiY * (e.beta / 180) * (gameHeight / 2) + gameHeight / 2;
//     if (newX < gameWidth && newX >= 0) {
//       mouseCoords.x = newX;
//     }
//     if (newY < gameHeight && newY >= 0) {
//       mouseCoords.y = newY;
//     }
//   });
//}
////Centered controls END

////Speed controls BEGIN
const speedCtrlsMultiX = 0.3;
const speedCtrlsMultiY = 0.5;
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (e) => {
    if (
      mouseCoords.x + Math.floor(e.gamma * speedCtrlsMultiX) < gameWidth &&
      mouseCoords.x + Math.floor(e.gamma * speedCtrlsMultiX) > 0
    ) {
      mouseCoords.x += Math.floor(e.gamma * speedCtrlsMultiX);
    }
    if (
      mouseCoords.y + Math.floor(e.beta * speedCtrlsMultiY) < gameHeight &&
      mouseCoords.y + Math.floor(e.beta * speedCtrlsMultiY) > 0
    ) {
      mouseCoords.y += Math.floor(e.beta * speedCtrlsMultiY);
    }
  });
}
////Speed controls END

//Player object
const player = new Player(0.15);
app.stage.addChild(player);
player.setPos(mouseCoords.x, mouseCoords.y);

const level = new GameLevel(levelsData[0], app);
for (const ball of level.targetBalls) {
  app.stage.addChild(ball);
  ball.setRandPos();
}

// const ball = new TargetBall(15, 15, 100, 0.01, { x: 1, y: 2 }, 3);
// app.stage.addChild(ball);
// ball.setRandPos();

//Game loop
// let tickerStop = false;
app.ticker.add((delta) => {
  player.followPointer(mouseCoords, delta);

  for (const targetBall of level.targetBalls) {
    targetBall.grow(delta);
    targetBall.move(delta);
  }

  // ball.grow(delta);
  //If player object touches the ball
  // if (ball.containsPoint(player.position)) {
  //   scoreCount.value += Math.floor(
  //     ball.maxRadius * (1 / (ball.radius - ball.initRadius + 1))
  //   );
  //   ball.setRandPos();
  //   ball.setRandDir();
  //   ball.resetRadius();
  // }

  // if (levelCount.value == 1) {
  // } else if (levelCount.value == 2) {
  //   ball.move(delta);
  // } else if (levelCount.value == 3 && !tickerStop) {
  //   tickerStop = true;
  //   let randomSeconds = Math.random() * (5 - 2) + 2;
  //   let randomMilliseconds = randomSeconds * 500;
  //   setTimeout(() => {
  //     ball.respawn();
  //     tickerStop = false;
  //   }, randomMilliseconds);
  // }
  // if (scoreCount.value > 100) {
  //   scoreCount.value = 0;
  //   levelCount.value++;
  // }
});

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

<template>
  <Modal v-if="modalVisible" @update-modal-visible="updateModalVisible">
  </Modal>
  <div class="flex flex-col">
    <div class="flex-row absolute top-0 left-0 w-full my-3">
      <div class="flex justify-between w-full">
        <h1 class="py-0 mx-5 my-0 text-6xl font-thin select-none cursor-none">
          LEVEL: {{ levelCount }}
        </h1>
        <h1 class="py-0 mx-5 my-0 text-6xl font-thin select-none cursor-none">
          SCORE: {{ scoreCount }}
        </h1>
      </div>
    </div>
    <div ref="gameWindow" class="cursor-none"></div>
  </div>
</template>

<script setup>
import Modal from "./ModalGenyou.vue";
let modalVisible = true;

const updateModalVisible = () => {
  startGameLoop();
};

import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
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

const level = new GameLevel(levelsData[0]);
for (const ball of level.targetBalls) {
  app.stage.addChild(ball);
}

//Game loop
function startGameLoop() {
  let tickerStop = false;
  app.ticker.add((delta) => {
    player.followPointer(mouseCoords, delta);

    for (const targetBall of level.targetBalls) {
      if (targetBall.isActive) {
        targetBall.grow(delta);
        targetBall.move(delta);
        if (targetBall.containsPoint(player.position)) {
          scoreCount.value += targetBall.pop();
        }
      }
    }
  });
}

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

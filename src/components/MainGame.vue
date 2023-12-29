<template>
  <Modal v-if="modalVisible" @update-modal-visible="updateModalVisible">
  </Modal>
  <div class="flex flex-col select-none cursor-none">
    <div class="flex flex-row justify-between absolute top-0 left-0 w-full">
      <h1 class="p-0 mx-5 my-5 sm:text-6xl text-3xl max-w-fit">
        LEVEL<br />{{ levelCount }}
      </h1>
      <h1 class="p-0 mx-5 my-5 sm:text-6xl text-3xl max-w-fit text-end">
        SCORE<br />{{ scoreCount }}
      </h1>
    </div>
    <div ref="gameWindow" class="cursor-none"></div>
  </div>
</template>

<style>
@font-face {
  font-family: larabie;
  src: url("src/assets/fonts/larabiefont rg.otf");
}

h1 {
  font-family: larabie;
  color: white;
}
</style>

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
import Asteroid from "./game/Asteroid";
import Background from "./game/Background";

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

//Background
const bg = new Background(app);
const bgTicker = app.ticker.add((delta) => {
  bg.animate(delta);
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
const player = new Player(0.15, mouseCoords.x, mouseCoords.y);
app.stage.addChild(player.trail, player);

const asts = [
  new Asteroid({ x: -1.5, y: -1 }, 40, { x: 3, y: 1 }, 5),
  new Asteroid({ x: -1, y: -1.2 }, 20, { x: 3, y: 1 }, 8),
  new Asteroid({ x: -1.5, y: -0.6 }, 30, { x: 3, y: 1 }, 6),
  new Asteroid({ x: -1.1, y: -0.7 }, 15, { x: 3, y: 1 }, 8),
  new Asteroid({ x: -1.1, y: -0.2 }, 40, { x: 3, y: 1 }, 5),
];
for (const ast of asts) {
  app.stage.addChild(ast);
  ast.show();
}

// const level = new GameLevel(levelsData[0]);

//Game loop
function startGameLoop() {
  // level.start(app);
  app.ticker.add((delta) => {
    player.followPointer(mouseCoords, delta);

    for (const ast of asts) {
      ast.move(delta);
      if (ast.isActive) {
        if (ast.containsPoint(player.position) && player.isVulnerable) {
          scoreCount.value += ast.pop();
          player.damage();
          bg.warp();
        }
      }
    }
    // for (const targetBall of level.targetBalls) {
    //   if (targetBall.isActive) {
    //     targetBall.grow(delta);
    //     targetBall.move(delta);
    //     if (targetBall.containsPoint(player.position)) {
    //       scoreCount.value += targetBall.pop();
    //     }
    //   }
    // }
  });
}

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

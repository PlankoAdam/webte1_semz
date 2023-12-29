<template>
  <ModalStart @update-modal-visible="closeStartModal" v-if="showStartModal">
  </ModalStart>
  <ModalNextLevel
    v-if="showNextLevelModal"
    :showModal="modalVisible"
    :score="scoreCount"
    @update-modal-visible="updateNextLevelModal"
  ></ModalNextLevel>
  <div class="flex flex-col">
    <div
      class="flex flex-row justify-between fixed top-0 left-0 w-full my-3 select-none cursor-none z-0"
      v-if="showText"
    >
      <h1 class="py-0 mx-5 my-0 sm:text-7xl text-4xl">
        LEVEL<br />{{ levelCount }}
      </h1>
      <h1 class="py-0 mx-5 my-0 sm:text-7xl text-4xl text-end">
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
import ModalStart from "./ModalStart.vue";
import ModalNextLevel from "./ModalNextLevel.vue";

const closeStartModal = (value, value2) => {
  showStartModal.value = value;
  showText.value = value2;
  startGameLoop();
};

import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
import Player from "./game/Player.js";
import GameLevel from "./game/GameLevel.js";
import * as color from "./game/colors.json";
import levelsData from "./game/levels.json";
import Asteroid from "./game/Asteroid.js";
import Background from "./game/Background.js";
import * as cats from "./game/cats.js";

let gameWindow = ref(null);
let scoreCount = ref(0);
let levelCount = ref(1);
const modalVisible = ref(false);
let showStartModal = ref(true);
let showNextLevelModal = ref(false);
let showText = ref(false);

const updateNextLevelModal = (value, value2) => {
  showNextLevelModal.value = value;
  showText.value = value2;
  scoreCount.value = 0;
  startGameLoop();
};

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
app.stage.hitArea = app.screen;

//Background
const bg = new Background(app);
const bgTicker = app.ticker.add((delta) => {
  bg.animate(delta);
});

//DESKTOP CONTROLS
//Set up mouse listener inside game area
app.stage.eventMode = "static";
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
  new Asteroid({ x: -0.5, y: -0.9 }, 40, { x: 3, y: 1 }, 5),
  new Asteroid({ x: -1, y: -1.2 }, 20, { x: 3, y: 1 }, 8),
  new Asteroid({ x: -1.5, y: -0.6 }, 30, { x: 3, y: 1 }, 6),
  new Asteroid({ x: -1.1, y: -0.7 }, 15, { x: 3, y: 1 }, 8),
  new Asteroid({ x: -1.1, y: -0.2 }, 40, { x: 3, y: 1 }, 5),
];

const cat = new cats.CatTwo({ x: -0.7, y: 0 }, 60, 120, { x: 2, y: 1 }, 0);

// const level = new GameLevel(levelsData[0]);

//Game loop
function startGameLoop() {
  // level.start(app);
  for (const ast of asts) {
    app.stage.addChild(ast);
    ast.show();
  }
  app.stage.addChild(cat);
  cat.show();
  app.ticker.start();
  app.ticker.add((delta) => {
    player.followPointer(mouseCoords, delta);

    for (const ast of asts) {
      ast.move(delta);
      if (ast.isActive) {
        if (ast.checkCollision(player.position) && player.isVulnerable) {
          scoreCount.value += ast.pop();
          player.damage();
          bg.warp();
        }
      }
    }
    if (cat.isActive) {
      cat.move(delta);
      cat.grow(delta);
      if (cat.checkCollision(player.position)) {
        scoreCount.value += cat.pop();
      }
    }
    if (scoreCount.value >= 100) {
      levelCount.value++;
      stopGameLoop();
      showNextLevelModal.value = true;
      showText.value = false;
    }
  });
}

function stopGameLoop() {
  app.ticker.stop();
}

function nextLevel() {}

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

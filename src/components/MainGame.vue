<template>
  <ModalStart @update-modal-start="closeStartModal" v-if="showStartModal">
  </ModalStart>
  <ModalNextLevel
    ref="modalNextLevel"
    :score="scoreCount"
    @next-level="nextLevel"
  ></ModalNextLevel>
  <div class="flex flex-col">
    <div
      class="flex flex-row justify-between fixed top-0 left-0 w-full my-3 select-none cursor-none z-0"
      v-if="showHUDText"
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
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
import Player from "./game/Player.js";
import GameLevel from "./game/GameLevel.js";
import levelsData from "./game/levels.json";
import * as color from "./game/colors.json";
import Background from "./game/Background.js";

let gameWindow = ref(null);
let scoreCount = ref(0);
let levelCount = ref(1);
let showStartModal = ref(true);
let showHUDText = ref(false);

const modalNextLevel = ref(null);

//Size of game area
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;
window.onResize = () => {
  gameWidth = window.innerWidth;
  gameHeight = window.innerHeight;
};

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
app.ticker.add((delta) => {
  bg.animate(delta);
});

let pointerCoords = { x: gameWidth / 2, y: gameHeight / 2 };

//DESKTOP CONTROLS
//Set up mouse listener inside game area
app.stage.eventMode = "static";
app.stage.on("mousemove", (e) => {
  pointerCoords.x = e.global.x;
  pointerCoords.y = e.global.y;
});

//MOBILE CONTROLS
//Add listener for change in device orientation on mobile devices
//Two types of controls available on mobile (comment out the unused one)

let calibrated = false;
let xOffset = 0;
let yOffset = 0;
////Centered controls BEGIN
const centereCtrlsMultiX = 7;
const centereCtrlsMultiY = 10;
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (e) => {
    if (!calibrated) {
      xOffset = -e.gamma;
      yOffset = -e.beta;
    }
    const newX =
      centereCtrlsMultiX * ((xOffset + e.gamma) / 180) * (gameWidth / 2) +
      gameWidth / 2;
    const newY =
      centereCtrlsMultiY * ((yOffset + e.beta) / 180) * (gameHeight / 2) +
      gameHeight / 2;
    if (newX < gameWidth && newX >= 0) {
      pointerCoords.x = newX;
    }
    if (newY < gameHeight && newY >= 0) {
      pointerCoords.y = newY;
    }
  });
}
////Centered controls END

////Speed controls BEGIN
// const speedCtrlsMultiX = 0.3;
// const speedCtrlsMultiY = 0.5;
// if (window.DeviceOrientationEvent) {
//   window.addEventListener("deviceorientation", (e) => {
//     if (!calibrated) {
//       xOffset = -e.gamma;
//       yOffset = -e.beta;
//     }
//     if (
//       mouseCoords.x + Math.floor((xOffset + e.gamma) * speedCtrlsMultiX) <
//         gameWidth &&
//       mouseCoords.x + Math.floor((xOffset + e.gamma) * speedCtrlsMultiX) > 0
//     ) {
//       mouseCoords.x += Math.floor((xOffset + e.gamma) * speedCtrlsMultiX);
//     }
//     if (
//       mouseCoords.y + Math.floor((yOffset + e.beta) * speedCtrlsMultiY) <
//         gameHeight &&
//       mouseCoords.y + Math.floor((yOffset + e.beta) * speedCtrlsMultiY) > 0
//     ) {
//       mouseCoords.y += Math.floor((yOffset + e.beta) * speedCtrlsMultiY);
//     }
//   });
// }
////Speed controls END

//Player object
const player = new Player(0.15, pointerCoords.x, pointerCoords.y);

let levels = [];
let currentLevelIndex = 0;
let scoreCounterID = 0;

function startGame() {
  app.stage.addChild(player.trail, player);

  for (const data of levelsData) {
    levels.push(new GameLevel(data));
  }
  currentLevelIndex = 0;
  nextLevel();
}

//Ticker callback function for controlling the player object
let playerTickerfn;

function nextLevel() {
  showHUDText.value = true;
  calibrated = true;
  app.ticker.add(
    (playerTickerfn = (delta) => {
      player.followPointer(pointerCoords, delta);
    })
  );
  const prevLevelScore = levels[currentLevelIndex].score;
  bg.warp();
  let scoreResetID = setInterval(() => {
    scoreCount.value -= Math.floor(prevLevelScore / 80);
    if (scoreCount.value <= 0) {
      scoreCount.value = 0;
      clearInterval(scoreResetID);
    }
  }, 50);
  currentLevelIndex = 0; //TODO
  levels[currentLevelIndex].score = 0;
  setTimeout(() => {
    startLevel(levels[currentLevelIndex]);
  }, 5000);
}

let gameLoopfn;
//Game loop
function startLevel(level) {
  level.start(app);

  scoreCounterID = setInterval(() => {
    scoreCount.value += Math.floor((level.score - scoreCount.value) / 2);
  }, 50);

  app.ticker.add(
    (gameLoopfn = (delta) => {
      for (const asteroid of level.asteroids) {
        if (asteroid.isActive) {
          asteroid.move(delta);
          if (asteroid.checkCollision(player.position) && player.isVulnerable) {
            level.score += asteroid.pop();
            player.damage();
          }
        }
      }

      for (const cat of level.cats) {
        if (cat.isActive) {
          cat.move(delta);
          cat.grow(delta);
          if (cat.checkCollision(player.position)) {
            level.score += cat.pop();
          }
        }
      }

      if (level.score >= level.scoreGoal) {
        stopLevel(level);
      }
    })
  );
}

function stopLevel(level) {
  level.stop(app);
  app.ticker.remove(playerTickerfn);
  app.ticker.remove(gameLoopfn);
  calibrated = false;
  clearInterval(scoreCounterID);
  scoreCount.value = level.score;
  showHUDText.value = false;
  modalNextLevel.value.show();
}

const closeStartModal = (value, value2) => {
  showStartModal.value = value;
  showHUDText.value = value2;
  startGame();
};

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

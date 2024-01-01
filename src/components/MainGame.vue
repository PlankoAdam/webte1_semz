<template>
  <ModalStart
    ref="modalStart"
    @continue-game="continueGame"
    @new-game="newGame"
    @random="randomLevels"
    :continue-available="continueAvailable"
  >
  </ModalStart>
  <ModalNextLevel
    ref="modalNextLevel"
    :score="scoreCount"
    @next-level="nextLevel"
    @restart-level="restartLevel"
  ></ModalNextLevel>
  <ModalFailLevel
    ref="modalFailLevel"
    @restart-level="restartLevel"
  ></ModalFailLevel>
  <PauseScreen ref="pauseScreen"></PauseScreen>
  <div class="flex flex-col">
    <div ref="hudDiv" class="cursor-none select-none z-0">
      <div
        class="flex flex-row justify-between fixed top-0 left-0 w-full my-3 mt-5"
        v-if="showHUDText"
      >
        <h1 class="py-0 mx-5 my-0 lg:text-7xl text-3xl">
          LEVEL<br />{{ currentLevelIndex + 1 }}
        </h1>
        <h1
          v-if="showHUDTimer"
          class="py-0 mx-5 my-0 lg:text-7xl text-3xl text-center"
        >
          {{ ("0" + Math.floor(timer / 60)).substr(-2) }}:{{
            ("0" + (timer % 60)).substr(-2)
          }}
        </h1>
        <h1 class="py-0 mx-5 my-0 lg:text-7xl text-3xl text-end">
          SCORE<br />{{ scoreCount }}
        </h1>
      </div>
      <div
        class="flex flex-row justify-end fixed bottom-0 right-0 w-full mb-10"
        v-if="showHUDText && isRunning"
      >
        <button
          @click="togglePause"
          class="py-0 mx-5 my-0 text-white lg:hidden"
        >
          <svg
            v-if="!isPaused"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M224 432h-80V80h80Zm144 0h-80V80h80Z"
            />
          </svg>
          <svg
            v-if="isPaused"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 512 512"
          >
            <path fill="currentColor" d="m96 448l320-192L96 64z" />
          </svg>
        </button>
      </div>
    </div>
    <div ref="gameWindow" class="cursor-none"></div>
  </div>
</template>

<script setup>
import ModalStart from "./ModalStart.vue";
import ModalNextLevel from "./ModalNextLevel.vue";
import ModalFailLevel from "./ModalFailLevel.vue";
import PauseScreen from "./PauseScreen.vue";
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";
import Player from "./game/Player.js";
import GameLevel from "./game/GameLevel.js";
import levelsData from "./game/levels.json";
import * as color from "./game/colors.json";
import Background from "./game/Background.js";
import { distance } from "./game/utils";

let gameWindow = ref(null);
let scoreCount = ref(0);
let timer = ref(0);
let showHUDText = ref(false);
let showHUDTimer = false;
let isPaused = ref(false);
let levelIndexes = [];
let randomized = false;

for (let i = 0; i < levelsData.length; i++) {
  levelIndexes.push(i);
}

const hudDiv = ref(null);
const modalStart = ref(null);
const modalNextLevel = ref(null);
const modalFailLevel = ref(null);
const pauseScreen = ref(null);

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
app.ticker.autoStart = false;

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

let currentLevel;
let currentLevelIndex = 0;
let scoreCounterID = 0;

function continueGame() {
  app.stage.addChild(player.trail, player);
  currentLevelIndex = Number(localStorage.getItem("userLevel"));
  nextLevel();
}

function newGame() {
  app.stage.addChild(player.trail, player);
  currentLevelIndex = -1;
  localStorage.removeItem("userLevel");
  nextLevel();
}

function randomLevels() {
  randomized = true;
  levelIndexes.sort((a, b) => {
    return 0.5 - Math.random();
  });
  newGame();
}

//Ticker callback function for controlling the player object
let playerTickerfn;
let prevLevelScore = 0;

function nextLevel() {
  currentLevelIndex++;
  resetLevel();

  bg.warp();
  setTimeout(() => {
    startLevel(currentLevel);
  }, bg.warpTime + 1000);
}

function resetLevel() {
  showHUDText.value = true;
  calibrated = true;
  app.ticker.add(
    (playerTickerfn = (delta) => {
      player.followPointer(pointerCoords, delta);
    })
  );

  //Roll score hud to 0
  let scoreResetID = setInterval(() => {
    scoreCount.value -= Math.floor(prevLevelScore / 40);
    if (
      (scoreCount.value <= 0 && prevLevelScore >= 0) ||
      (scoreCount.value >= 0 && prevLevelScore < 0)
    ) {
      scoreCount.value = 0;
      clearInterval(scoreResetID);
    }
  }, 40);

  if (currentLevelIndex >= levelsData.length) {
    currentLevelIndex = 0;
  }
  currentLevel = new GameLevel(levelsData[levelIndexes[currentLevelIndex]]);
  currentLevel.score = 0;

  if (currentLevel.timeLimitSec != 0) {
    timer.value = currentLevel.timeLimitSec;
    showHUDTimer = true;
  }
}

function restartLevel() {
  console.log("restart level");
  resetLevel();
  setTimeout(() => {
    startLevel(currentLevel);
  }, 2000);
}

let gameLoopfn;
let activeCatsCount;
let timerIntervalID;
let isRunning = ref(false);
//Game loop
function startLevel(level) {
  isRunning.value = true;
  level.start(app);
  activeCatsCount = level.cats.length;

  if (showHUDTimer && timer.value != 0) {
    timerIntervalID = setInterval(() => {
      if (!isPaused.value) {
        if (timer.value == 0) {
          clearInterval(timerIntervalID);
          levelFail(level);
        }
        timer.value--;
      }
    }, 1000);
  }

  scoreCounterID = setInterval(() => {
    scoreCount.value += Math.floor((level.score - scoreCount.value) / 2);
  }, 50);

  const allCats = level.cats.concat(level.goldCats);
  app.ticker.add(
    (gameLoopfn = (delta) => {
      for (const asteroid of level.asteroids) {
        if (asteroid.isActive) {
          asteroid.move(delta);
          if (asteroid.checkCollision(player.position) && player.isVulnerable) {
            level.score += asteroid.pop();
            player.damage();
          }
          if (
            distance(asteroid.position, {
              x: gameWidth / 2,
              y: gameHeight / 2,
            }) >
            3 * (gameWidth > gameHeight ? gameWidth : gameHeight)
          ) {
            asteroid.reset();
            asteroid.show();
          }
        }
      }

      for (const cat of allCats) {
        if (cat.isActive) {
          cat.animate(delta);
          //Collect cat
          if (cat.checkCollision(player.position)) {
            level.score += cat.pop();
            if (!cat.isGold) {
              activeCatsCount--;
            }
          }
        }
      }

      if (activeCatsCount <= 0) {
        clearInterval(timerIntervalID);
        levelComplete(level);
      }
    })
  );
}

function stopLevel(level) {
  isRunning.value = false;
  level.stop(app);

  app.ticker.remove(playerTickerfn);
  app.ticker.remove(gameLoopfn);
  calibrated = false;

  clearInterval(scoreCounterID);
  scoreCount.value = level.score;
  prevLevelScore = level.score;

  showHUDText.value = false;
  showHUDTimer = false;
}

function levelComplete(level) {
  stopLevel(level);
  modalNextLevel.value.show();
  if (!randomized) {
    localStorage.setItem("userLevel", currentLevelIndex);
  }
}

function levelFail(level) {
  stopLevel(level);
  modalFailLevel.value.show();
}

function togglePause() {
  if (isPaused.value) {
    resume();
  } else {
    pause();
  }
}

function pause() {
  if (isRunning.value) {
    app.ticker.stop();
    isPaused.value = true;
    pauseScreen.value.pause();
    hudDiv.value.classList.add("cursor");
  }
}

function resume() {
  if (isRunning.value) {
    isPaused.value = false;
    pauseScreen.value.resume();
    hudDiv.value.classList.remove("cursor");

    app.ticker.start();
  }
}

let continueAvailable = ref(false);
let keyup = true;
onMounted(() => {
  gameWindow.value.appendChild(app.view);
  modalStart.value.show();
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && keyup) {
      togglePause();
    }
    keyup = false;
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
      keyup = true;
    }
  });

  if (localStorage.getItem("userLevel")) {
    continueAvailable.value = true;
  }
});
</script>

<style>
@font-face {
  font-family: larabie;
  src: url("../assets/fonts/larabiefont rg.otf");
}

h1 {
  font-family: larabie;
  color: white;
}

.cursor {
  cursor: default !important;
}
</style>

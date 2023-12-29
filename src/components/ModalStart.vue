<template>
  <div class="modal cursor-default z-10" @click.stop="closeDesc">
    <div class="modal-content">
      <div class="image-container">
        <img
          src="./photos/deepspace.png"
          class="w-full sm:w-3/5 -my-8 lg:-my-24"
        />
      </div>
      <div class="buttons">
        <button
          @click="closeModal"
          class="start md:text-4xl text-2xl m-0 max-w-fit"
        >
          START!
        </button>
        <button
          @click.stop="showDesc"
          class="gamedesc md:text-2xl m-0 text-1xl max-w-fit"
        >
          Game Description
        </button>
        <div v-if="description">
          <p class="text">
            Ball Destroyer is a game whose purpose is to destroy the randomly
            generated balls as quickly as possible, which keep getting bigger
            and bigger. The faster a ball can be knocked out, the more points
            the player can score. The balls must be destroyed with the custom
            cursor. The controls are very simple. On a computer, the cursor
            follows the movement of the mouse, and on a phone, it moves where
            you tilt the phone with the help of gyroscopes. The game has several
            levels with different difficulties. The balls move with different
            mechanisms depending on the level. Sometimes, however, they just
            stand still. Try the ball destroyer yourself and find out how good
            your reaction time is!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let description = ref(false);
const emits = defineEmits(["update-modal-start"]);

function closeModal() {
  emits("update-modal-start", false, true);
}

function showDesc() {
  if (description.value == true) {
    description.value = false;
  } else {
    description.value = true;
  }
}

function closeDesc() {
  if (description.value == true) {
    description.value = false;
  }
}
</script>

<style>
@font-face {
  font-family: spaceRanger;
  src: url("src/assets/fonts/space_ranger/spaceranger.ttf");
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
}

.modal-content {
  background-color: #ffffff00;
  padding: 20px;
  border-radius: 5px;
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.start,
.gamedesc {
  min-width: 10%;
  min-height: fit-content;
  color: aliceblue;
  font-family: spaceRanger;
  transition: 0.3s ease;
  margin: 0;
}

.start {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.start:hover,
.gamedesc:hover {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff,
    0 0 40px #00ffff, 0 0 50px #00ffff;
  transition: 0.3s ease;
}

.text {
  color: aliceblue;
  max-width: 1000px;
  width: auto;
}

.image-container {
  display: flex;
  justify-content: center;
}
</style>

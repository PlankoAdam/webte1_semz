<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <img src="./photos/title.png" />
      <div class="buttons">
        <button @click="closeModal" class="start"></button>
        <button @click="showDesc" class="gamedesc"></button>
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

const showModal = ref(true);
let description = ref(false);
const emits = defineEmits(["update-modal-visible"]);

function closeModal() {
  showModal.value = false;
  emits("update-modal-visible");
}

function showDesc() {
  if (description.value == true) {
    description.value = false;
  } else {
    description.value = true;
  }
}
</script>

<style>
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
  min-width: 100%;
  min-height: 75px;
  background-image: url("./photos/startOrange.png");
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  transition: background-image 0.3s ease;
}

.gamedesc {
  background-image: url("./photos/gameDescOrange.png");
}

.start:hover {
  background-image: url("./photos/startCyan.png");
}

.gamedesc:hover {
  background-image: url("./photos/gameDescCyan.png");
}

.text {
  color: aliceblue;
  max-width: 1000px;
  width: auto;
}
</style>

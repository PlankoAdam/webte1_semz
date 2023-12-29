<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <img src="./photos/levelfinished.png" />
      <div class="score">
        <img src="./photos/yourScore.png" />
        <a>{{ score }}</a>
      </div>
      <div class="buttons">
        <button class="next" @click="closeModal"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const emits = defineEmits(["update-modal-visible"]);

const props = defineProps({
  showModal: Boolean,
  score: Number,
});

function closeModal() {
  emits("update-modal-visible", false, 0);
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

.next {
  min-width: 100%;
  min-height: 75px;
  background-image: url("./photos/nextLevelOrange.png");
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  transition: background-image 0.3s ease;
}

.next:hover {
  background-image: url("./photos/nextLevelCyan.png");
}

.score {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

a {
  color: aliceblue;
  font-size: 2rem;
}
</style>

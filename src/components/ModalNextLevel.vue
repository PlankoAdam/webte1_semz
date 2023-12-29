<template>
  <div class="modal cursor-default z-10" v-if="showModal">
    <div class="modal-content">
      <div class="logo">
        <img
          src="./photos/levelcomplete.png"
          class="image w-full -my-8 sm:w-3/5"
        />
      </div>
      <div class="score">
        <a class="md:text-4xl text-2xl m-0 max-w-fit"
          >Your Score: {{ score }}</a
        >
        <button
          class="level md:text-2xl m-0 text-1xl max-w-fit"
          @click="closeModal"
        >
          Next Level!
        </button>
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
  emits("update-modal-visible", false);
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

.score {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

a {
  min-width: 10%;
  min-height: fit-content;
  color: aliceblue;
  font-family: spaceRanger;
  transition: 0.3s ease;
  margin: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.logo {
  display: flex;
  justify-content: center;
}

.complete {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto; /* Center the image horizontally */
}

.level {
  min-width: 10%;
  min-height: fit-content;
  color: aliceblue;
  font-family: spaceRanger;
  transition: 0.3s ease;
  margin: 0;
}

.level:hover {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff,
    0 0 40px #00ffff, 0 0 50px #00ffff;
  transition: 0.3s ease;
}

.image {
  max-width: 75%; /* Set a maximum width */
  height: auto; /* Allow the height to adjust proportionally */
}
</style>

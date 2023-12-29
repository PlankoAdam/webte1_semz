<template>
  <div class="modal cursor-default z-10">
    <div class="modal-content">
      <div class="image-container">
        <img
          src="./photos/levelcomplete.png"
          class="image w-full -my-8 sm:w-3/5"
        />
      </div>
      <div class="buttons">
        <a class="md:text-4xl text-2xl m-0 max-w-fit"
          >Your Score: {{ score }}</a
        >
        <button
          class="start md:text-2xl m-0 text-1xl max-w-fit"
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
  score: Number,
});

function closeModal() {
  emits("update-modal-visible", false, true);
}
</script>

<style>
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

.image {
  max-width: 75%;
  height: auto;
}
</style>

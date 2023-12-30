<template>
  <div
    class="modal cursor-default z-10 backdrop-brightness-200 backdrop-blur-sm"
  >
    <div class="modal-content">
      <div class="image-container">
        <img
          src="./photos/levelcomplete.png"
          class="w-full lg:w-4/5 -my-4 lg:-my-20 xl:-my-24 -mx-10"
        />
      </div>
      <div class="buttons">
        <a class="md:text-4xl text-2xl m-0 max-w-fit"
          >Your Score: {{ score }}</a
        >
        <button
          class="start md:text-4xl text-3xl m-0 max-w-fit"
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

const emits = defineEmits(["update-modal-next-level"]);

const props = defineProps({
  score: Number,
});

function closeModal() {
  emits("update-modal-next-level", false, true);
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
</style>

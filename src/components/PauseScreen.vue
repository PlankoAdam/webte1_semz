<template>
  <div
    ref="mainDiv"
    class="flex fixed w-full h-full backdrop-blur-sm justify-center items-center transition-all opacity-0 cursor-none select-none"
  >
    <h1 class="text-center text-9xl drop-shadow-[5px_5px_5px_rgba(0,0,0,0.7)]">
      Paused
    </h1>
  </div>
</template>

<script setup>
import { ref } from "vue";

const mainDiv = ref(null);

function resume() {
  mainDiv.value.classList.add("opacity-0");
  mainDiv.value.classList.remove("opacity-1");
  mainDiv.value.classList.add("cursor-none");
}

function pause() {
  mainDiv.value.classList.remove("opacity-0");
  mainDiv.value.classList.add("opacity-1");
  mainDiv.value.classList.remove("cursor-none");
}

defineExpose({ pause, resume });
</script>

<style></style>

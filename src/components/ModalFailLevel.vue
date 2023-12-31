<template>
  <div ref="modalDiv" class="modal cursor-default z-10 hidden">
    <div class="modal-content">
      <div class="image-container">
        <img
          ref="imgCont"
          src="../assets/photos/levelfailed.png"
          class="w-full lg:w-4/5 -my-4 lg:-my-20 xl:-my-24 -mx-10"
        />
      </div>
      <div class="buttons">
        <button
          ref="reLvlBtn"
          class="start restart md:text-4xl text-3xl m-0 max-w-fit"
          @click="closeModal('restart-level')"
        >
          Restart Level
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

const modalDiv = ref(null);
const imgCont = ref(null);
const reLvlBtn = ref(null);

const emits = defineEmits(["restart-level"]);

function closeModal(event) {
  modalDiv.value.classList.add("select-none");
  modalDiv.value.classList.add("cursor-none");

  imgCont.value.classList.remove("drop1");
  reLvlBtn.value.classList.remove("drop3");

  imgCont.value.classList.add("slideupanim");
  reLvlBtn.value.classList.add("slidedownanim2");

  setTimeout(() => {
    modalDiv.value.classList.add("hidden");
  }, 1600);

  emits(event);
}

const show = () => {
  modalDiv.value.classList.remove("select-none");
  modalDiv.value.classList.remove("cursor-none");
  modalDiv.value.classList.remove("hidden");

  imgCont.value.classList.add("drop1");
  reLvlBtn.value.classList.add("drop3");

  imgCont.value.classList.remove("slideupanim");
  reLvlBtn.value.classList.remove("slidedownanim2");
};

defineExpose({ show });
</script>

<style>
.restart:hover {
  text-shadow: 0 0 10px #f00000, 0 0 20px #f00000, 0 0 30px #f00000,
    0 0 40px #f00000, 0 0 50px #f00000;
  transition: 0.3s ease;
}
</style>

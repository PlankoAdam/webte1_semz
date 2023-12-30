<template>
  <div
    ref="modalDiv"
    class="modal cursor-default z-10 backdrop-brightness-200 backdrop-blur-sm hidden"
  >
    <div class="modal-content">
      <div class="image-container">
        <img
          ref="imgCont"
          src="./photos/levelcomplete.png"
          class="w-full lg:w-4/5 -my-4 lg:-my-20 xl:-my-24 -mx-10"
        />
      </div>
      <div class="buttons">
        <a ref="scoreDisplay" class="md:text-4xl text-2xl m-0 max-w-fit"
          >Your Score: {{ score }}</a
        >
        <button
          ref="nextLvlBtn"
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
import { defineProps, ref } from "vue";

const modalDiv = ref(null);
const imgCont = ref(null);
const scoreDisplay = ref(null);
const nextLvlBtn = ref(null);

const emits = defineEmits(["next-level"]);

const props = defineProps({
  score: Number,
});

function closeModal() {
  modalDiv.value.classList.add("hidden");
  imgCont.value.classList.remove("drop1");
  scoreDisplay.value.classList.remove("drop2");
  nextLvlBtn.value.classList.remove("drop3");
  emits("next-level");
}

const show = () => {
  modalDiv.value.classList.remove("hidden");
  imgCont.value.classList.add("drop1");
  scoreDisplay.value.classList.add("drop2");
  nextLvlBtn.value.classList.add("drop3");
};

defineExpose({ show });
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

@keyframes anim {
  from {
    transform: scale(5);
  }

  to {
    transform: scale(1);
  }
}

.drop1 {
  animation-name: anim;
  animation-duration: 1 s;
}

.drop2 {
  animation-name: anim;
  animation-duration: 1 s;
  animation-delay: 0.5s;
}

.drop3 {
  animation-name: anim;
  animation-duration: 1 s;
  animation-delay: 1s;
}
</style>

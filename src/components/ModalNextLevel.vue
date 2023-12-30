<template>
  <div ref="modalDiv" class="modal cursor-default z-10 hidden">
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
  modalDiv.value.classList.add("select-none");
  modalDiv.value.classList.add("cursor-none");

  imgCont.value.classList.remove("drop1");
  scoreDisplay.value.classList.remove("drop2");
  nextLvlBtn.value.classList.remove("drop3");

  imgCont.value.classList.add("slideupanim");
  scoreDisplay.value.classList.add("slidedownanim2");
  nextLvlBtn.value.classList.add("slidedownanim");

  setTimeout(() => {
    modalDiv.value.classList.add("hidden");
  }, 1500);

  emits("next-level");
}

const show = () => {
  modalDiv.value.classList.remove("select-none");
  modalDiv.value.classList.remove("cursor-none");
  modalDiv.value.classList.remove("hidden");

  imgCont.value.classList.add("drop1");
  scoreDisplay.value.classList.add("drop2");
  nextLvlBtn.value.classList.add("drop3");

  imgCont.value.classList.remove("slideupanim");
  scoreDisplay.value.classList.remove("slidedownanim2");
  nextLvlBtn.value.classList.remove("slidedownanim");
};

defineExpose({ show });
</script>

<style>
a {
  min-width: 10%;
  min-height: fit-content;
  color: aliceblue;
  font-family: spaceRanger;
  margin: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

@keyframes drop {
  from {
    transform: scale(10);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.drop1 {
  animation: drop 0.5s 0s both ease-in;
}

.drop2 {
  animation: drop 0.5s 0.5s both ease-in;
}

.drop3 {
  animation: drop 0.5s 1s both ease-in;
}

@keyframes slideup {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-1000px);
  }
}

.slideupanim {
  animation: slideup 1s 0s both ease-in;
}

@keyframes slidedown {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(1000px);
  }
}

.slidedownanim {
  animation: slidedown 1s 0s both ease-in;
}

.slidedownanim2 {
  animation: slidedown 1s 0.3s both ease-in;
}
</style>

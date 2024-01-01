<template>
  <div ref="modalDiv" class="modal cursor-default z-10" @click.stop="closeDesc">
    <div class="modal-content">
      <div class="image-container">
        <img
          ref="imgCont"
          src="../assets/photos/deepspace.png"
          class="w-full lg:w-4/5 -my-8 lg:-my-24 xl:-my-32 -mx-10"
        />
      </div>
      <div class="buttons content-center w-full">
        <button
          :disabled="!continueAvailable"
          ref="continueBtn"
          @click="closeModal('continue-game')"
          class="start md:text-4xl text-4xl m-0 max-w-fit"
        >
          CONTINUE
        </button>
        <button
          ref="newGameBtn"
          @click="closeModal('new-game')"
          class="start md:text-4xl text-4xl m-0 max-w-fit"
        >
          NEW GAME
        </button>
        <button
          ref="descBtn"
          @click.stop="showDesc"
          class="gamedesc md:text-2xl m-0 text-2xl max-w-fit mb-3 mt-5"
        >
          Game Description
        </button>
        <div v-if="description" class="max-h-0 md:w-3/5 w-4/5 self-center">
          <p class="text text-justify lg:text-lg">
            Greetings cosmic rescuer! Your mission involves skillfully
            navigating your spacecraft through asteroid fields to save stranded
            space kitties. Dodge the celestial obstacles with precision and
            speed, proving your agility in the cosmic expanse. Are you ready to
            embark on a heartwarming journey through the galactic frontier? Your
            feline friends are counting on you!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const modalDiv = ref(null);
const imgCont = ref(null);
const continueBtn = ref(null);
const newGameBtn = ref(null);
const descBtn = ref(null);
let description = ref(false);
const emits = defineEmits(["new-game", "continue-game"]);

const props = defineProps({
  continueAvailable: {
    type: Boolean,
    default: false,
  },
});

function showDesc() {
  descBtn.value.blur();
  if (description.value == true) {
    description.value = false;
  } else {
    description.value = true;
  }
}

function closeDesc() {
  descBtn.value.blur();
  if (description.value == true) {
    description.value = false;
  }
}

function closeModal(event) {
  newGameBtn.value.blur();
  continueBtn.value.blur();

  modalDiv.value.classList.add("select-none");
  modalDiv.value.classList.add("cursor-none");

  descBtn.value.classList.add("startanim1");
  newGameBtn.value.classList.add("startanim2");
  continueBtn.value.classList.add("startanim3");
  imgCont.value.classList.add("startanim4");

  setTimeout(() => {
    modalDiv.value.classList.add("hidden");
  }, 2000);
  emits(event);
}

const show = () => {
  modalDiv.value.classList.remove("hidden");
};

defineExpose({ show });
</script>

<style>
@font-face {
  font-family: spaceRanger;
  src: url("src/assets/fonts/space_ranger/spaceranger.ttf");
}

p {
  font-family: larabie;
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
}

.modal-content {
  background-color: #ffffff00;
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
}

.start {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}

.start:hover,
.gamedesc:hover {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff,
    0 0 40px #00ffff, 0 0 50px #00ffff;
  transition: 0.3s ease;
}

.start:disabled {
  text-shadow: none !important;
  cursor: default !important;
}

.text {
  color: aliceblue;
}

.image-container {
  display: flex;
  justify-content: center;
}

@keyframes shrink {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}

.startanim1 {
  animation: shrink 0.8s ease-in-out both;
  cursor: none !important;
}

.startanim2 {
  animation: shrink 0.8s 0.2s ease-in-out both;
  cursor: none !important;
}

.startanim3 {
  animation: shrink 0.8s 0.4s ease-in-out both;
  cursor: none !important;
}

.startanim4 {
  animation: shrink 0.8s 0.6s ease-in-out both;
  cursor: none !important;
}
</style>

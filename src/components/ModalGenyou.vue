<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <p>modal more</p>
      <button @click="closeModal">Close Modal</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: true,
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.$emit("update-modal-visible");
    },
  },
};
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
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>

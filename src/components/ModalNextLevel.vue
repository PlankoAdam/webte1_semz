<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content"></div>
  </div>
</template>

<script setup></script>

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
</style>

<template>
  <canvas ref="canv"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";

let canvWidth = window.innerWidth;
let canvHeight = window.innerHeight;
const canv = ref(null);
let ctx;
let ballX = 200;
let ballY = 100;

onMounted(() => {
  ctx = canv.value.getContext("2d");
  canv.value.width = canvWidth;
  canv.value.height = canvHeight;
  window.addEventListener("mousemove", (e) => {
    ballX = e.clientX;
    ballY = e.clientY;
  });
  window.addEventListener("resize", () => {
    canvWidth = window.innerWidth;
    canvHeight = window.innerHeight;
    canv.value.width = canvWidth;
    canv.value.height = canvHeight;
  });
  animate();
});

function drawBall(ctx, x, y) {
  const size = 50;
  ctx.clearRect(0, 0, canvWidth, canvHeight);
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = "orange";
  ctx.fill();
}

function animate() {
  drawBall(ctx, ballX, ballY);
  requestAnimationFrame(animate);
}
</script>

<template>
  <div ref="gameWindow"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";

const moveSpeed = 0.15;

let gameWindow = ref(null);
let app = new PIXI.Application({ width: 900, height: 800 });
let mouseCoords = { x: 0, y: 0 };

const player = app.stage.addChild(
  new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawPolygon(0, 0, 15, 50, 0, 40, -15, 50)
    .endFill()
);
player.position.set(app.screen.x / 2, app.screen.y / 2);
player.acceleration = new PIXI.Point(0);

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("mousemove", (e) => {
  mouseCoords.x = e.global.x;
  mouseCoords.y = e.global.y;
});

app.ticker.add((delta) => {
  // player.acceleration.set(
  //   player.acceleration.x * deaccelRate,
  //   player.acceleration.y * deaccelRate
  // );

  if (
    app.screen.width > mouseCoords.x ||
    mouseCoords.x > 0 ||
    app.screen.height > mouseCoords.y ||
    mouseCoords.y > 0
  ) {
    const toMouseDirection = new PIXI.Point(
      mouseCoords.x - player.x,
      mouseCoords.y - player.y
    );

    const angleToMouse = Math.atan2(toMouseDirection.x, toMouseDirection.y);
    const dist = distance(mouseCoords, player.position);
    const playerSpeed = dist * moveSpeed;

    const rotatationAngle =
      Math.atan2(toMouseDirection.y, toMouseDirection.x) + Math.PI / 2;
    player.rotation = rotatationAngle;

    player.acceleration.set(
      Math.sin(angleToMouse) * playerSpeed,
      Math.cos(angleToMouse) * playerSpeed
    );
  }

  player.x += player.acceleration.x * delta;
  player.y += player.acceleration.y * delta;
});

function testForAABB(object1, object2) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

function distance(p1, p2) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.hypot(a, b);
}

onMounted(() => {
  gameWindow.value.appendChild(app.view);
});
</script>

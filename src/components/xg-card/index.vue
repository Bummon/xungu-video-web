<template>
  <div class="xg-card-container">
    <div class="card2">
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="xg-card"></script>
<style lang="scss" scoped>
.xg-card-container,
.card2 {
  box-sizing: content-box;
  width: 400px;
  height: 200px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.xg-card-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
  border-radius: 20px;
  transition: all 0.3s;
}
.card2 {
  background-color: silver;
  border-radius: 20px;
  transition: all 0.2s;
}
.card2:hover {
  border-radius: 20px;
  transform: scale(0.98);
}
.card:hover {
  box-shadow: 0 0 30px 2px rgb(0 255 117 / 30%);
}
.slot {
  color: #ffffff;
}
</style>

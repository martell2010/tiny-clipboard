<template>
  <div class="app-floating-button">
    CB
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss">
.app-floating-button {
  position: fixed;
  top: 5px;
  right: 5px;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--floating-button-size, 30px);
  height: var(--floating-button-size, 30px);
  border-radius: 50%;
  background-color: var(--floating-button-color, #fefefe);
  box-shadow: 0 0 5px 5px var(--floating-button-color);
  color: var(--floating-button-text-color);
}
</style>

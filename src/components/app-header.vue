<template>
  <header class="app-clipboard__header">
    <div class="app-clipboard__header-logo">
      <img
        :src="logo"
        alt="clipboard"
      >
      Tiny clipboard
    </div>
    <div class="app-clipboard__header-setting">
      #1.0.0
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.svg?url';
</script>

<style lang="scss">
.app-clipboard__header {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  align-items: center;
  padding-inline: 10px;
  background-color: var(--bg-header-color);
  color: var(--text-header-color);

  &-logo {
    display: flex;
    align-items: center;

    img {
      width: 25px;
      height: 25px;
      object-fit: contain;
      margin-right: 4px;
    }

    font-size: 14px;
  }
}
</style>

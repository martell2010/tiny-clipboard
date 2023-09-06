<template>
  <div class="app-item-list">
    <slot />
  </div>
</template>
<style lang="scss">
.app-item-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  padding: 15px;
}
</style>

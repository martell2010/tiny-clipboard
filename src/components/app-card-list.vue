<template>
  <div class="app-card-list">
    <slot />
  </div>
</template>
<style lang="scss">
.app-card-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--main-padding);
  padding: var(--main-padding);
}
</style>

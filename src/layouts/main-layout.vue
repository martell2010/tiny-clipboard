<template>
  <div class="app-clipboard">
    <slot name="header" />
    <main class="app-clipboard__content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.app-clipboard {
  width: var(--max-width);
  height: var(--max-height);
  display: grid;
  grid-template-rows: 40px 1fr;
  background-color: var(--bg-main-color);
  color: var(--main-text-color);
  overflow: hidden;

  &__content {
    color: inherit;
    overflow: auto;
  }
}
</style>

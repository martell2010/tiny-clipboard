<template>
  <div class="app-item">
    <img
      class="app-item__icon"
      :src="data.icon || ''"
      alt="icon"
    >
    <div class="app-item__title">
      {{ data.title }}
    </div>
    <div class="app-item__content">
      {{ data.content }}
    </div>
  </div>
</template>
<script  setup lang="ts">
import { ClipboardItem } from "@/types/clipboard.ts";

defineProps<{
  data: ClipboardItem
}>();
</script>
<style lang="scss">
.app-item {
  display: grid;
  grid-template-columns: 20px 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  background-color: var(--bg-card-color);
  color: var(--main-text-color);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 6px 26px rgba(0,0,0,.08);

  &__icon {
    max-width: 100%;
    object-fit: contain;
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
  }

  &__content {
    grid-column: 2;
    font-size: 12px;
  }
}
</style>

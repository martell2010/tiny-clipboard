<template>
  <div
    class="app-card"
    :class="{ 'app-card--is-grouped': isGrouped }"
  >
    <div
      v-if="isGrouped && !isSingle"
      class="app-card__actions"
    >
      <app-action-button
        type="expand"
        title="Expand"
        @click="emit('toggle', data.id)"
      />
    </div>
    <div
      v-else
      class="app-card__actions"
    >
      <app-action-button
        v-if="!isSingle"
        type="collapse"
        title="Collapse"
        @click="emit('toggle', data.id)"
      />
      <app-action-button
        type="copy"
        title="Copy"
        @click="emit('copy', data)"
      />
      <app-action-button
        type="link"
        title="Go to website"
        @click="emit('link', data)"
      />
      <app-action-button
        type="trash"
        title="Delete"
        @click="emit('remove', data.id)"
      />
    </div>
    <div class="app-card__grid">
      <img
        class="app-card__icon"
        :src="data.icon || ''"
        alt=""
      >
      <div class="app-card__title">
        {{ data.title }}
      </div>
      <div class="app-card__content">
        {{ data.content }}
      </div>
    </div>
  </div>
</template>
<script  setup lang="ts">
import { ClipboardData } from "@/types/clipboard.ts";
import AppActionButton from "@/components/app-action-button.vue";

defineProps<{
  data: ClipboardData;
  isGrouped: boolean;
  isSingle: boolean;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  copy: [data: ClipboardData];
  link: [data: ClipboardData];
  remove: [id: number];
}>()

</script>
<style lang="scss">
.app-card {
  position: relative;
  background-color: var(--bg-card-color);
  color: var(--main-text-color);
  border-radius: 10px;
  padding: 10px;
  max-width: calc(var(--max-width) - var(--main-padding) * 2);
  box-shadow: 0 6px 26px rgba(0,0,0,.08);
  height: var(--card-height, auto);
  &--is-grouped {
    --card-height: 60px;

    .app-card__title, .app-card__content{
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .app-card__content {
      -webkit-line-clamp: 2;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-template-rows: auto 1fr;
    gap: 10px;
    transition: 0.5s filter;
  }

  &__icon {
    max-width: 100%;
    object-fit: contain;
    &:before {
      content: ' ';
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      background-image: url("@/assets/logo.svg");
      background-position: center;
      background-size: contain;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    word-break: break-word;
  }

  &__content {
    grid-column: 2;
    word-break: break-word;
    font-size: 12px;
  }

  &__actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    opacity: 0;
    visibility: hidden;
    transition: 0.5s opacity;
  }

  &:hover {
    .app-card__actions {
      visibility: visible;
      opacity: 0.7;
    }
    .app-card__grid {
      filter: blur(5px);
    }
  }
}
</style>

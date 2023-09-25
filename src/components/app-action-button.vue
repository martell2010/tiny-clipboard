<template>
  <Popper
    arrow
    hover
    :content="title"
  >
    <button
      class="app-action-button"
      @click="emit('click', true)"
    >
      <img
        :src="icons[type]"
        :alt="type"
      >
    </button>
  </Popper>
</template>

<script setup lang="ts">
import Popper from "vue3-popper";
import trash from '@/assets/icons/trash.svg';
import copy from '@/assets/icons/copy.svg';
import link from '@/assets/icons/link.svg';
import collapse from '@/assets/icons/collapse.svg';
import expand from '@/assets/icons/expand.svg';

type IconType = 'trash' | 'copy' | 'link' | 'collapse' | 'expand';

defineProps<{
  type: IconType;
  title?: string;
}>();

const icons: Record<IconType, string> = {
  trash: trash,
  copy: copy,
  link: link,
  collapse: collapse,
  expand: expand,
}

const emit = defineEmits<{
  click: [v: boolean]
}>()
</script>

<style lang="scss">
.app-action-button {
  border: none;
  background: transparent;
  z-index: 10;
  color: inherit;
  cursor: pointer;

  img {
    width: 25px;
    height: 25px;
    object-fit: contain;
  }
}
</style>

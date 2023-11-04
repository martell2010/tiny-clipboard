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
      <component
        :is="icons[type]"
        class="app-action-button__icon"
      />
    </button>
  </Popper>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper';
import trash from '@/assets/icons/trash.svg';
import copy from '@/assets/icons/copy.svg';
import link from '@/assets/icons/link.svg';
import collapse from '@/assets/icons/collapse.svg';
import expand from '@/assets/icons/expand.svg';
import share from '@/assets/icons/share.svg';

type IconType = 'trash' | 'copy' | 'link' | 'collapse' | 'expand' | 'share';

defineProps<{
  type: IconType;
  title?: string;
}>();

const icons: Record<IconType, string> = {
  trash,
  copy,
  link,
  collapse,
  expand,
  share,
};

const emit = defineEmits<{
  click: [v: boolean]
}>();

</script>

<style lang="scss">
.app-action-button {
  border: none;
  background: transparent;
  z-index: 10;
  color: inherit;
  cursor: pointer;

  &__icon {
    color: var(--main-text-color);
    width: 25px;
    height: 25px;
    svg {
      color: var(--main-text-color);
    }
    img {
      object-fit: contain;
    }

  }

}
</style>

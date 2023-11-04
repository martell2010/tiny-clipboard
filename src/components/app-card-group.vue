<template>
  <div :class="mainClasses">
    <div
      v-for="(item, i) in group"
      :key="item.id"
      :style="{
        '--offset': -100*i + '%',
        '--z-index': group.length - i,
      }"
      :class="itemClasses"
    >
      <slot v-bind="{ item, isGrouped, onToggle, isSingle }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useCssModule } from 'vue';
import { ClipboardData } from '@/types/clipboard';

const classes = useCssModule();

const props = defineProps<{
  group: ClipboardData[],
}>();

defineSlots<{
  default(data: {
    item: ClipboardData,
    isGrouped: boolean,
    isSingle: boolean,
    onToggle: () => void
  }): any
}>();

const isExpanded = ref<boolean>(false);
const isGrouped = computed(() => props.group.length > 1 && !isExpanded.value);
const isSingle = computed(() => props.group.length <= 1);

const onToggle = () => {
  isExpanded.value = !isExpanded.value;
};

const mainClasses = computed(() => [
  classes['app-card-group'],
  {
    [classes['app-card-group--is-single']]: isSingle.value,
    [classes['app-card-group--is-expanded']]: isExpanded.value,
  },
]);

const itemClasses = computed(() => [
  classes['app-card-group__item'],
  {
    [classes['app-card-group__item--is-expanded']]: isExpanded.value,
    [classes['app-card-group__item--is-single']]: isSingle.value,
  },
]);

</script>
<style lang="scss" module>
.app-card-group {
  position: relative;
  &:not(.app-card-group--is-expanded) {
    margin-bottom: calc(var(--main-padding) - 5px);
  }

  &--is-single {
    margin-bottom: 0;
  }

  &__item {
    position: relative;
    transition: transform .3s, opacity 1s;
    transition-timing-function: ease-in-out;

    &:nth-of-type(1):not(.app-card-group__item--is-single):before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateY(0) scaleX(1);
      background-color: var(--bg-card-color);
      border-radius: 10px;
      box-shadow: 0 6px 26px rgba(0,0,0,.08);
    }

    &:not(.app-card-group__item--is-expanded) {
      z-index: var(--z-index);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity 0s;
      transform: translateY(var(--offset, 0));
      pointer-events: none;
      &:not(:nth-of-type(1)):not(:nth-of-type(2))  :global(.app-card) {
        box-shadow: none;
      }
      &:nth-of-type(1) {
        display: initial;
        position: relative;
        opacity: 1;
        pointer-events: all;
        transform: none;
        &:before {
          transform: translateY(10px) scaleX(0.9);
        }
      }
    }

    &--is-expanded:not(:last-of-type) {
      margin-bottom: var(--main-padding);
    }
  }
}
</style>

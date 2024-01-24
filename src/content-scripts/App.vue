<template>
  <div class="app-clipboard">
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
    <main class="app-clipboard__content">
      <app-card-list>
        <app-card-group
          v-for="(group, key) in clipboardList"
          :key="key"
          :group="group"
        >
          <template #default="{ item, isSingle, isGrouped, onToggle }">
            <app-card
              :is-grouped="isGrouped"
              :is-single="isSingle"
              :data="item"
              @toggle="onToggle"
              @copy="onCopy"
              @link="onLink"
              @share="onShare"
              @remove="onRemove"
            />
          </template>
        </app-card-group>
      </app-card-list>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClipboardData } from '@/types/clipboard';
import AppCard from '@/components/app-card.vue';
import AppCardList from '@/components/app-card-list.vue';
import AppCardGroup from '@/components/app-card-group.vue';
import logo from '@/assets/logo.svg?url';
import ClipboardService from '@/services/ClipboardService.ts';
import type { ClipboardGroupedList } from '@/services/ClipboardService.ts';

const clipboardList = ref<ClipboardGroupedList>({});

let ClipboardManager: ClipboardService | null = null;

const onStorageChange = async () => {
  clipboardList.value = await ClipboardManager?.getSortedAndGroupedData() ?? {};
};

const onRemove = (key: number) => {
  ClipboardManager?.removeItem(key);
};

const onCopy = (data: ClipboardData) => {
  ClipboardManager?.copy(data);
};

const onShare = (data: ClipboardData) => {
  ClipboardManager?.share(data);
};

const onLink = (data: ClipboardData) => {
  ClipboardManager?.openLink(data.url);
};

onMounted(() => {
  ClipboardManager = new ClipboardService(window, document, chrome, onStorageChange);
  onStorageChange();
});

onUnmounted(() => {
  ClipboardManager?.destroy();
});
</script>

<style lang="scss">
.app-clipboard {
  width: var(--max-width);
  height: var(--max-height);
  display: grid;
  grid-template-rows: 40px 1fr;
  background-color: var(--bg-main-color);
  color: var(--main-text-color);
  overflow: hidden;

  &__header {
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

  &__content {
    color: inherit;
    overflow: auto;
  }
}
</style>

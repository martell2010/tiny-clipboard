<template>
  <main-layout>
    <template #header>
      <app-header />
    </template>
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
  </main-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClipboardData, ClipboardGroupedList } from '@/types/clipboard';
import AppCard from '@/components/app-card.vue';
import AppCardList from '@/components/app-card-list.vue';
import AppCardGroup from '@/components/app-card-group.vue';
import ClipboardService from '@/services/ClipboardService.ts';
import AppHeader from '@/components/app-header.vue';
import MainLayout from '@/layouts/main-layout.vue';

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

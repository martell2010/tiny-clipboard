<template>
  <main-layout>
    <template #header>
      <app-header />
    </template>
    <app-empty v-if="isEmptyClipboardList" />
    <app-card-list v-else>
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
            @remove-group="onRemoveGroup(group)"
          />
        </template>
      </app-card-group>
    </app-card-list>
  </main-layout>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { ClipboardData, ClipboardGroupedList } from '@/types/clipboard';
import AppCard from '@/components/app-card.vue';
import AppCardList from '@/components/app-card-list.vue';
import AppCardGroup from '@/components/app-card-group.vue';
import ClipboardService from '@/services/ClipboardService.ts';
import AppHeader from '@/components/app-header.vue';
import MainLayout from '@/layouts/main-layout.vue';
import AppEmpty from '@/components/app-empty.vue';

const clipboardList = ref<ClipboardGroupedList>({});

let ClipboardManager: ClipboardService | null = null;

const isEmptyClipboardList = computed(() => !Object.keys(clipboardList.value).length);

const setList = async () => {
  clipboardList.value = await ClipboardManager?.getSortedAndGroupedData() ?? {};
};

const onRemove = (key: number) => {
  ClipboardManager?.remove(key);
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

const onRemoveGroup = (group: ClipboardData[]) => {
  const ids = group.map(({ id }) => id);
  ClipboardManager?.remove(ids);
};

onMounted(() => {
  ClipboardManager = new ClipboardService(window, document, chrome, setList);
  setList();
});

onUnmounted(() => {
  ClipboardManager?.destroy();
});
</script>


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
        #
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
import { onMounted, onUnmounted, ref } from "vue";
// import { RecycleScroller } from 'vue-virtual-scroller'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { ClipboardData } from "@/types/clipboard.ts";
import AppCard from "@/components/app-card.vue";
import AppCardList from "@/components/app-card-list.vue";
import AppCardGroup from "@/components/app-card-group.vue";
import { ITEM_PREFIX_KEY } from "@/constants";
import logo from '@/assets/logo.svg';

type ClipboardGroupedList = Record<ClipboardData['hostname'], ClipboardData[]>;

const clipboardList = ref<ClipboardGroupedList>({});

const groupByHosName = (data: ClipboardGroupedList, [,target]:[string,ClipboardData]) => {
  if(target.hostname in data) {
    data[target.hostname].push(target);
    return data;
  }

  return { ...data, [target.hostname]: [target]}
}

const onStorageChange = () => {
  chrome.storage.sync.get().then((result) => {
    console.time('onStorageChange');
    console.log('onStorageChange', Object.entries(result).length);
    clipboardList.value = Object.entries(result)
        .filter(([k]) =>k.includes(ITEM_PREFIX_KEY))
        .sort(([, a]:[string, ClipboardData], [, b]:[string, ClipboardData]) => b.id - a.id)
        .reduce(groupByHosName, {})
    console.timeEnd('onStorageChange');
  });
}

const onRemove = (key: number) => {
  chrome.storage.sync.remove(`${ITEM_PREFIX_KEY}${key}`);
};

const onCopy = (data: ClipboardData) => {
  const type = "text/plain";
  const blob = new Blob([data.content], { type });
  const d = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(d);
}

const onShare = async (data: ClipboardData) => {
  const { title, content: text, url } = data;
  const shareData = {
    title,
    text,
    url,
  }

  if (!navigator.share || !navigator.canShare(shareData)){
    return
  }

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log('Share error: ', err)
  }
}
const onLink = (data: ClipboardData) => {
    chrome.tabs.create({ url: data.url, active: true });
}

onMounted(() => {
  chrome.storage.onChanged.addListener(onStorageChange);
  onStorageChange();
});

onUnmounted(() => {
  chrome.storage.onChanged.removeListener(onStorageChange);
})
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

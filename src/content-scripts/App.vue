
<template>
  <div class="app-clipboard">
    <header class="app-clipboard__header">
      <div class="app-clipboard__header-logo">
        CB
      </div>
      <div class="app-clipboard__header-setting">
        #
      </div>
    </header>
    <main class="app-clipboard__content">
      <app-items-list>
        <app-item
          v-for="(item, i) in clipboardList"
          :key="i"
          :data="item"
        />
      </app-items-list>
    </main>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {MESSAGE_TYPE} from "@/types/message-types";
import {ClipboardItem} from "@/types/clipboard.ts";
import AppItem from "@/components/app-item.vue";
import AppItemsList from "@/components/app-items-list.vue";


const clipboardList = ref<ClipboardItem[]>([])
const onStorageChange = () => {
  chrome.storage.sync.get(["cb"]).then((result) => {
    console.log("Value currently is " + result.cb);
    clipboardList.value = result.cb ?? []
  });
}


onMounted(async () => {
  onStorageChange();
  chrome.runtime.onMessage.addListener((request, sender) => {
    console.log({ request, sender });
    if(request.type === MESSAGE_TYPE.COPY) {
      onStorageChange();
    }
  })
})
// import AppFloatingButton from '@/components/app-floating-button.vue';
</script>
<style lang="scss">
.app-clipboard {
  width: 300px;
  height: 400px;
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
    //border-bottom: 1px solid white;
    padding-inline: 10px;
    background-color: var(--bg-header-color);
    color: var(--text-header-color);
  }

  &__content {
    color: inherit;
    overflow: auto;
  }
}
</style>

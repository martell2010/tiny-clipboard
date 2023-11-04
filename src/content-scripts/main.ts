import { createApp } from 'vue';
import App from './App.vue';
import '../assets/styles/index.scss';

createApp(App).mount('#app');

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log({ request, sender, d: 'adasdas' });
});

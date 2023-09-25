import { ClipboardData } from "@/types/clipboard.ts";
import { ITEM_PREFIX_KEY } from "@/constants";

const errorHandler = (e: unknown) => console.warn('Error', e);

document.addEventListener('copy',  (event) => {
    const text = window?.getSelection()?.toString() ?? '';
    const icon = document.querySelector('[rel="shortcut icon"]') ?? document.querySelector('[rel="icon"]');
    const date = new Date();
    const id = date.getTime();

    console.log({event, text})

    const payload: ClipboardData = {
        id,
        title: document.title,
        date,
        url: window.location.href,
        hostname: window.location.hostname,
        content: text,
        icon: (icon as HTMLLinkElement)?.href ?? '',
    };

    chrome.storage.sync.set({ [`${ITEM_PREFIX_KEY}${id}`]: payload }).catch(errorHandler)

});


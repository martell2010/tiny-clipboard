import { MESSAGE_TYPE } from "@/types/message-types";
import browser from "webextension-polyfill";
import {ClipboardItem} from "@/types/clipboard.ts";

const errorHandler = (e: unknown) => console.warn('Error', e)
document.addEventListener('copy',  (event) => {
    const text = window?.getSelection()?.toString() ?? '';
    const icon = document.querySelector('[rel="shortcut icon"]') || document.querySelector('[rel="icon"]');
    console.log({event, text})

    const payload: ClipboardItem = {
        title: document.title,
        date: new Date(),
        url: window.location.href,
        content: text,
        icon: (icon as HTMLLinkElement)?.href ?? '',
    }

    chrome.storage.sync.get(["cb"]).then((result) => {
        chrome.storage.sync.set({ cb: [payload, ...(result?.cb || [])] }).catch(errorHandler)
        browser.runtime.sendMessage({ type: MESSAGE_TYPE.COPY, payload }).catch(errorHandler)
    })

})

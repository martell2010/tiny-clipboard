import { ClipboardData } from "@/types/clipboard.ts";
import {ITEM_PREFIX_KEY, STORAGE_NAME} from "@/constants";

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
        date: date.toString(),
        url: window.location.href,
        hostname: window.location.hostname,
        content: text,
        icon: (icon as HTMLLinkElement)?.href ?? '',
    };

    const error = chrome?.runtime?.lastError;

    if (error) {
        alert(error);
    }

    const key = ITEM_PREFIX_KEY+payload.hostname;
    chrome.storage.sync.get([STORAGE_NAME]).then((r) => {

        console.log({r})
        const value = r[STORAGE_NAME]?.[key];
        console.log({value})
        const {[key]: _, ...storage } = r[STORAGE_NAME] ?? {};
        console.log({storage})

        const data:Record<`${typeof ITEM_PREFIX_KEY}${string}`, ClipboardData[]>  = {
            [key]: Array.isArray(value) ? [payload, ...value] : [payload],
            ...storage,
        }

        chrome.storage.sync.set({ [STORAGE_NAME]: data }).catch(errorHandler)
    }).catch(errorHandler)

});


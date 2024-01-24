import { ClipboardData, ClipboardGroupedList } from '@/types/clipboard.ts';
import { ITEM_PREFIX_KEY } from '@/constants';

type ChromeApiEvent = (changes: chrome.storage.StorageChange, areaName: string) => Promise<void>
interface ChromeAPI {
  storage: {
    local: chrome.storage.LocalStorageArea;
    onChanged: {
      addListener: (listener: ChromeApiEvent) => void;
      removeListener: (listener: ChromeApiEvent) => void;
    }
  };
  tabs: {
    create: typeof chrome.tabs.create,
  }
}

type StorageEntry = [string, ClipboardData];

/**
 * ClipboardService class
 * @class
 */
export default class ClipboardService {
  /**
   * The context of the window
   * @type {Window}
   */
  private context: Window;

  /**
   * The document of the window
   * @type {Document}
   */
  private document: Document;

  /**
   * The navigator of the window
   * @type {Navigator}
   */
  private navigator: Navigator;

  /**
   * The chrome API
   * @type {ChromeAPI}
   */
  private chrome: ChromeAPI;

  /**
   * The change storage callback
   * @type {ChromeApiEvent}
   */
  private readonly changeStorageCallback: ChromeApiEvent;

  /**
   * The errors array
   * @type {any[]}
   */
  private errors: any[] = [];

  /**
   * Creates a new instance of the ClipboardService class
   * @param {Window} context - The context of the window
   * @param {Document} document - The document of the window
   * @param {ChromeAPI} chrome - The chrome API
   * @param {ChromeApiEvent} changeStorageCallback - The change storage callback
   */
  constructor(
    context: Window,
    document: Document,
    chrome: ChromeAPI,
    changeStorageCallback: ChromeApiEvent = () => Promise.resolve(),
  ) {
    this.context = context;
    this.document = document;
    this.navigator = context.navigator;
    this.chrome = chrome;
    this.changeStorageCallback = changeStorageCallback;
    this.chrome.storage.onChanged.addListener(this.changeStorageCallback);
  }

  /**
   * Gets the storage of the chrome API
   * @type {ChromeAPI['storage']['local']}
   */
  get storage(): ChromeAPI['storage']['local'] {
    return this.chrome.storage.local;
  }

  /**
   * Gets the tabs of the chrome API
   * @type {ChromeAPI['tabs']}
   */
  get tabs(): ChromeAPI['tabs'] {
    return this.chrome.tabs;
  }

  /**
   * Creates a new clipboard payload
   * @returns {ClipboardData} The clipboard data
   */
  createPayload(): ClipboardData {
    const content = this.context.getSelection()?.toString() ?? '';
    const icon = this.document.querySelector('[rel="shortcut icon"]') ?? document.querySelector('[rel="icon"]');
    const date = new Date();
    const id = date.getTime();

    return {
      id,
      title: document.title,
      date,
      url: this.context.location.href,
      hostname: this.context.location.hostname,
      content,
      icon: (icon as HTMLLinkElement)?.href ?? '',
    };
  }

  /**
   * Sets a new clipboard item
   */
  async add() {
    await this.cleanUpStorage();
    const payload = this.createPayload();
    this.storage.set({ [`${ITEM_PREFIX_KEY}${payload.id}`]: payload }).catch(this.errorHandler);
  }

  /**
   * Removes a clipboard item(s)
   * @param {number | string | (number | string)[]} k
   */
  remove(k: number | string | (number | string)[]) {
    const getKey = (key: number | string) => (typeof key === 'string' && key?.startsWith(ITEM_PREFIX_KEY) ? key : `${ITEM_PREFIX_KEY}${key}`);

    const keys = Array.isArray(k) ? k.map(getKey) : getKey(k);

    this.storage.remove(keys).catch(this.errorHandler);
  }

  /**
   * Gets the sorted and grouped clipboard data
   * @returns {Promise<ClipboardGroupedList>} The grouped clipboard data
   */
  async getSortedAndGroupedData(): Promise<ClipboardGroupedList> {
    try {
      const storageData = await this.storage.get();
      return Object.fromEntries(Object.entries(storageData)
        .filter(([k]) => k.includes(ITEM_PREFIX_KEY))
        .sort(([, a]:StorageEntry, [, b]:StorageEntry) => b.id - a.id)
        .reduce((list: Map<ClipboardData['hostname'], ClipboardData[]>, [, v]:StorageEntry) => {
          const data = [...(list.get(v.hostname) ?? []), v];
          list.set(v.hostname, data);

          return list;
        }, new Map()));
    } catch (e) {
      this.errorHandler(e);
      return {};
    }
  }

  /**
   * Cleans up the storage
   */
  async cleanUpStorage() {
    const HALF_MB: number = 500_000;
    let uses = await this.storage.getBytesInUse();
    const { QUOTA_BYTES } = this.storage;

    while (QUOTA_BYTES - uses < HALF_MB) {
      // eslint-disable-next-line no-await-in-loop
      uses = await this.storage.getBytesInUse();
      this.storage.get()
        .then((result) => {
          const keys = Object.keys(result);
          const lastItemKey = keys[keys.length - 1];

          if (lastItemKey) {
            this.remove(lastItemKey);
          }
        });
    }
  }

  /**
   * Opens a link in a new tab
   * @param {string} url - The URL to open
   * @param {boolean} active - Whether to activate the tab
   */
  openLink(url: string, active: boolean = true) {
    this.tabs.create({ url, active });
  }

  /**
   * Copies data to the clipboard
   * @param {ClipboardData} data - The data to copy
   */
  copy(data: ClipboardData) {
    const type = 'text/plain';
    const blob = new Blob([data.content], { type });
    const d = [new ClipboardItem({ [type]: blob })];

    this.navigator.clipboard.write(d).catch(this.errorHandler);
  }

  /**
   * Shares data
   * @param {ClipboardData} data - The data to share
   */
  async share(data: ClipboardData) {
    const { title, content: text, url } = data;
    const shareData = {
      title,
      text,
      url,
    };

    if (!this.navigator.share || !this.navigator.canShare(shareData)) {
      return;
    }

    this.navigator.share(shareData).catch(this.errorHandler);
  }

  /**
   * Destroys the service
   */
  destroy() {
    this.errors = [];
    this.chrome.storage.onChanged.removeListener(this.changeStorageCallback);
  }

  /**
   * Error handler
   * @param {unknown} e - The error
   */
  errorHandler(e: unknown) {
    this.errors.push(e);
    console.warn('Clipboard service ERROR:', e);
  }

  /**
   * Gets the errors
   * @returns {any[]} The errors
   */
  getErrors() {
    return this.errors;
  }
}

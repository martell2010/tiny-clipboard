import ClipboardService from '@/services/ClipboardService.ts';

const ClipboardManager = new ClipboardService(window, document, chrome);

document.addEventListener('copy', () => ClipboardManager.add());

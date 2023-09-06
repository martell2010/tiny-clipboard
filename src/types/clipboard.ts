export type ClipboardItem = {
    title: string;
    url: string;
    date: Date | string;
    content: string | Blob;
    icon: string | null;
}

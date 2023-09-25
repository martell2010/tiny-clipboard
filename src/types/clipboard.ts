export type ClipboardData = {
    id: number;
    title: string;
    url: string;
    hostname: string;
    date: Date | string;
    content: string | Blob;
    icon: string | null;
}


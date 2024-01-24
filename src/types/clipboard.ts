export type ClipboardData = {
    id: number;
    title: string;
    url: string;
    hostname: string;
    date: Date | string;
    content: string;
    icon: string | null;
}

export type ClipboardGroupedList = Record<ClipboardData['hostname'], ClipboardData[]>;

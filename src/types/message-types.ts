export const MESSAGE_TYPE = {
    INIT: 'INIT',
    UPDATE: 'UPDATE',
    COPY: 'COPY',
    LINK: 'LINK'
} as const;

export type MessageType = keyof typeof MESSAGE_TYPE;

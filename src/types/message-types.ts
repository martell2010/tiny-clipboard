export const MESSAGE_TYPE = {
    INIT: 'INIT',
    UPDATE: 'UPDATE',
    COPY: 'COPY',
} as const;

export type MessageType = keyof typeof MESSAGE_TYPE;

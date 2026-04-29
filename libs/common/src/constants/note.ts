export const SEARCH_SERVICE = 'SEARCH_SERVICE';

export const RabbitEvents = {
    NOTE_CREATED: 'note_created',
    NOTE_UPDATED: 'note_updated',
    NOTE_DELETED: 'note_deleted',
} as const;

export const QUEUES = {
    SEARCH_INDEXING: 'search_indexing_queue',
} as const;

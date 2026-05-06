import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';

export const noteEmbeddings = pgTable('note_embeddings', {
    id: uuid('id').primaryKey(),
    title: text('title').notNull(),
    preview: text('preview').notNull(),
    embedding: vector('embedding', { dimensions: 768 }),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

import { Inject, Injectable } from '@nestjs/common';
import { EmbeddingService } from 'apps/search-service/src/notes/embedding.service';
import { desc, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { noteEmbeddings } from './db/schema';
import * as schema from './db/schema';

@Injectable()
export class SearchNotesService {
    constructor(
        @Inject('DRIZZLE_CONNECTION')
        private readonly db: NodePgDatabase<typeof schema>,
        private readonly embeddingService: EmbeddingService,
    ) {}

    async indexNoteCreate(id: string, title: string, content: string) {
        const vector = await this.embeddingService.generate(content);
        const preview =
            content.substring(0, 100) + (content.length > 100 ? '...' : '');

        return await this.db
            .insert(noteEmbeddings)
            .values({ id, title, preview, embedding: vector })
            .onConflictDoUpdate({
                target: noteEmbeddings.id,
                set: {
                    title,
                    preview,
                    embedding: vector,
                    updatedAt: new Date(),
                },
            });
    }

    async indexNoteUpdate(
        id: string,
        title: string | null,
        content: string | null,
    ) {
        const updates = {};

        if (title !== null) {
            updates['title'] = title;
        }

        if (content !== null) {
            updates['embedding'] =
                await this.embeddingService.generate(content);
            updates['preview'] =
                content.substring(0, 100) + (content.length > 100 ? '...' : '');
        }

        if (Object.keys(updates).length === 0) {
            return;
        }

        return this.db
            .update(noteEmbeddings)
            .set({ ...updates })
            .where(eq(noteEmbeddings.id, id));
    }

    async indexNoteDelete(id: string) {
        return this.db.delete(noteEmbeddings).where(eq(noteEmbeddings.id, id));
    }

    async search(query: string, limit: 5) {
        const queryVector = await this.embeddingService.generate(query, true);
        const queryVectorLiteral = `[${queryVector.join(',')}]`;

        const similarity = sql<number>`1 - (${noteEmbeddings.embedding} <=> ${queryVectorLiteral}::vector)`;

        const results = await this.db
            .select({
                id: noteEmbeddings.id,
                title: noteEmbeddings.title,
                preview: noteEmbeddings.preview,
                score: similarity,
            })
            .from(noteEmbeddings)
            .where(sql`${similarity} > 0.5`)
            .orderBy(desc(similarity))
            .limit(limit);

        return results;
    }
}

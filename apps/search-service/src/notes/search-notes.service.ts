import { Inject, Injectable } from '@nestjs/common';
import { EmbeddingService } from 'apps/search-service/src/notes/embedding.service';
import { desc, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { noteEmbeddings } from './db/schema';
import * as schema from './db/schema';

@Injectable()
export class SearchNotesService {
    constructor(
        @Inject('DRIZZLE_CONNECTION') private readonly db: NodePgDatabase<typeof schema>,
        private readonly embeddingService: EmbeddingService,
    ) {}

    async indexNote(id: string, title: string, content: string) {
        const vector = await this.embeddingService.generate(content);
        const preview =
            content.substring(0, 100) + (content.length > 100 ? '...' : '');

        return await this.db.insert(noteEmbeddings)
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

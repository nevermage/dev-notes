import { Module } from '@nestjs/common';
import { DatabaseModule } from 'apps/search-service/src/db/database.module';
import { SearchNotesModule } from 'apps/search-service/src/notes/search-notes.module';

@Module({
    imports: [DatabaseModule, SearchNotesModule],
})
export class SearchServiceModule {}

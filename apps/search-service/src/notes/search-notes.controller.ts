import { NoteEventPayload, RabbitEvents } from '@app/common';
import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SearchNotesDto } from 'apps/search-service/src/notes/dto/search-notes.dto';
import { SearchNotesService } from 'apps/search-service/src/notes/search-notes.service';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class SearchNotesController {
    constructor(
        private readonly logger: PinoLogger,
        private readonly searchNotesService: SearchNotesService,
    ) {}

    @EventPattern(RabbitEvents.NOTE_CREATED)
    async handleNoteCreated(@Payload() data: NoteEventPayload) {
        this.logger.info({ noteId: data.id }, `Received event: ${data.title}`);

        await this.searchNotesService.indexNote(data.id, data.title, data.content);

        this.logger.info(
            { noteId: data.id },
            `Note successfully dispatched to index`,
        );
    }

    @Get('search')
    async search(@Query() requestDto: SearchNotesDto) {
        return this.searchNotesService.search(requestDto.query, 5);
    }
}

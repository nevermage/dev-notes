import { NoteEventPayload, RabbitEvents } from '@app/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class SearchController {
    constructor(private readonly logger: PinoLogger) {}

    @EventPattern(RabbitEvents.NOTE_CREATED)
    handleNoteCreated(@Payload() data: NoteEventPayload) {
        this.logger.info({ noteId: data.id }, `Processing note: ${data.title}`);
    }
}

import { NoteEventDto, RabbitEvents } from '@app/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('search')
export class SearchController {
    @EventPattern(RabbitEvents.NOTE_CREATED)
    handleNoteCreated(@Payload() noteDto: NoteEventDto) {
        console.log('got note', noteDto);
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { CreateUpdateNoteDto } from 'apps/dev-notes/src/notes/dto/create-update-note.dto';
import { NotesService } from 'apps/dev-notes/src/notes/notes.service';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post('')
    create(@Body() dto: CreateUpdateNoteDto) {
        return this.notesService.create(dto);
    }

    @Get()
    getAll() {
        return this.notesService.findAll();
    }

    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.findById(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CreateUpdateNoteDto,
    ) {
        return this.notesService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.delete(id);
    }
}

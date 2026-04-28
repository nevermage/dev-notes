import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';
import { CreateNoteDto } from 'apps/dev-notes/src/notes/dto/create-note.dto';
import { NotesService } from 'apps/dev-notes/src/notes/notes.service';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post('')
    create(@Body() createDto: CreateNoteDto) {
        return this.notesService.create(createDto);
    }

    @Get()
    getAll() {
        return this.notesService.findAll();
    }

    @Get(':id')
    getById(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.findById(id);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.delete(id);
    }
}

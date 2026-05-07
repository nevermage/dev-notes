import { RabbitEvents, SEARCH_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CreateUpdateNoteDto } from 'apps/dev-notes/src/notes/dto/create-update-note.dto';
import { Note } from 'apps/dev-notes/src/notes/entities/note.entity';
import { ClsService } from 'nestjs-cls';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
        @Inject(SEARCH_SERVICE) private readonly client: ClientProxy,
        private readonly cls: ClsService,
        private readonly logger: PinoLogger,
    ) {}

    async create(dto: CreateUpdateNoteDto): Promise<Note> {
        const note = this.noteRepository.create(dto);
        const createdNote = await this.noteRepository.save(note);

        const currentTraceId = this.cls.get<string>('traceId');

        this.client.emit(RabbitEvents.NOTE_CREATED, {
            ...createdNote,
            traceId: currentTraceId,
        });
        this.logger.info(
            { noteId: createdNote.id },
            `Passed note to sync: ${createdNote.title}`,
        );

        return createdNote;
    }

    async findAll(): Promise<Note[]> {
        return await this.noteRepository.find({ order: { id: 'DESC' } });
    }

    async findById(id: string): Promise<Note | null> {
        return await this.noteRepository.findOneBy({ id });
    }

    async update(id: string, dto: CreateUpdateNoteDto): Promise<Note> {
        const note = await this.noteRepository.findOneBy({ id });

        if (note === null) {
            throw new Error(`Note ${id} not found`);
        }

        note.title = dto.title;
        note.content = dto.content;

        const updatedNote = await this.noteRepository.save(note);
        const currentTraceId = this.cls.get<string>('traceId');

        this.client.emit(RabbitEvents.NOTE_UPDATED, {
            ...updatedNote,
            traceId: currentTraceId,
        });
        this.logger.info(
            { noteId: updatedNote.id },
            `Passed note to sync: ${updatedNote.title}`,
        );

        return updatedNote;
    }

    async delete(id: string): Promise<DeleteResult> {
        const result = await this.noteRepository.delete({ id });

        const currentTraceId = this.cls.get<string>('traceId');

        this.client.emit(RabbitEvents.NOTE_DELETED, {
            id,
            traceId: currentTraceId,
        });
        this.logger.info({ noteId: id }, `Passed note to delete`);

        return result;
    }
}

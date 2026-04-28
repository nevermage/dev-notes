import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNoteDto } from 'apps/dev-notes/src/notes/dto/create-note.dto';
import { Note } from 'apps/dev-notes/src/notes/entities/note.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>,
    ) {}

    async create(dto: CreateNoteDto): Promise<Note> {
        const note = this.noteRepository.create(dto);
        return await this.noteRepository.save(note);
    }

    async findAll(): Promise<Note[]> {
        return await this.noteRepository.find({ order: { id: 'DESC' } });
    }

    async findById(id: string): Promise<Note | null> {
        return await this.noteRepository.findOneBy({ id });
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.noteRepository.delete({ id });
    }
}

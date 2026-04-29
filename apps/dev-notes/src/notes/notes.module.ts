import { QUEUES, SEARCH_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'apps/dev-notes/src/notes/entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Note]),
        ClientsModule.register([
            {
                name: SEARCH_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
                    queue: QUEUES.SEARCH_INDEXING,
                    queueOptions: { durable: true },
                },
            },
        ]),
    ],
    providers: [NotesService],
    controllers: [NotesController],
})
export class NotesModule {}

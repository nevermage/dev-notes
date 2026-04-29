import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { NotesModule } from './notes/notes.module';

@Module({
    imports: [
        LoggerModule.forRoot(),
        NotesModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
})
export class AppModule {}

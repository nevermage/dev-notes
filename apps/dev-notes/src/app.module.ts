import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { ClsModule, ClsService } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { NotesModule } from './notes/notes.module';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: {
                mount: true,
                setup: (cls, req) => {
                    const headerTraceId = req.headers['x-trace-id'];

                    const incomingTraceId =
                        (typeof headerTraceId === 'string' && headerTraceId) ||
                        randomUUID();

                    cls.set('traceId', incomingTraceId);
                },
            },
        }),
        LoggerModule.forRootAsync({
            imports: [ClsModule],
            inject: [ClsService],
            useFactory: (cls: ClsService) => ({
                pinoHttp: {
                    autoLogging: false,
                    mixin: () => {
                        const traceId = cls.get<string>('traceId');
                        return traceId ? { traceId } : {};
                    },

                    formatters: {
                        level: (label) => {
                            return { level: label };
                        },
                    },
                },
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
        }),
        NotesModule,
    ],
})
export class AppModule {}

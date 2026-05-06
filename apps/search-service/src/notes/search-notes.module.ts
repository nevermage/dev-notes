import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from 'apps/search-service/src/db/database.module';
import { ClsModule, ClsService } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { LoggingContextInterceptor } from './interceptors/logging-context.interceptor';
import { EmbeddingService } from 'apps/search-service/src/notes/embedding.service';
import { SearchNotesController } from 'apps/search-service/src/notes/search-notes.controller';
import { SearchNotesService } from 'apps/search-service/src/notes/search-notes.service';

@Module({
    imports: [
        DatabaseModule,
        ClsModule.forRoot({
            global: true,
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
    ],
    providers: [
        EmbeddingService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingContextInterceptor,
        },
        SearchNotesService,
    ],
    controllers: [SearchNotesController],
})
export class SearchNotesModule {}

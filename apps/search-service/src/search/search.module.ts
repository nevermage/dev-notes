import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule, ClsService } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { LoggingContextInterceptor } from './interceptors/logging-context.interceptor';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
        }),
        LoggerModule.forRootAsync({
            imports: [ClsModule],
            inject: [ClsService],
            useFactory: (cls: ClsService) => ({
                pinoHttp: {
                    mixin: () => {
                        const traceId = cls.get<string>('traceId');
                        return traceId ? { traceId } : {};
                    },
                },
            }),
        }),
    ],
    providers: [
        SearchService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingContextInterceptor,
        },
    ],
    controllers: [SearchController],
})
export class SearchModule {}

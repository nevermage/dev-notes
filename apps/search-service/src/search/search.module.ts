import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
    imports: [LoggerModule.forRoot()],
    providers: [SearchService],
    controllers: [SearchController],
})
export class SearchModule {}

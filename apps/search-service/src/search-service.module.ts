import { Module } from '@nestjs/common';
import { SearchServiceController } from './search-service.controller';
import { SearchServiceService } from './search-service.service';
import { SearchModule } from './search/search.module';

@Module({
    imports: [SearchModule],
    controllers: [SearchServiceController],
    providers: [SearchServiceService],
})
export class SearchServiceModule {}

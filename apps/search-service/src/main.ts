import { QUEUES } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchModule } from 'apps/search-service/src/search/search.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        SearchModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: [
                    process.env.RABBITMQ_URL ||
                        'amqp://guest:guest@rabbitmq:5672',
                ],
                queue: QUEUES.SEARCH_INDEXING,
                queueOptions: {
                    durable: true,
                },
            },
        },
    );

    await app.listen();
    console.log('Search Service is listening for messages...');
}
bootstrap();

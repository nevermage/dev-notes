import { QUEUES } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { SearchModule } from './search/search.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        SearchModule,
        {
            bufferLogs: true,
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

    app.useLogger(app.get(Logger));

    await app.listen();
    app.get(Logger).log('Search Service is listening for messages...');
}
void bootstrap();

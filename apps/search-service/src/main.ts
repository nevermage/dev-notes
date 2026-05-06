import { QUEUES } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SearchServiceModule } from './search-service.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create(SearchServiceModule, {
        bufferLogs: true,
    });

    app.useLogger(app.get(Logger));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [
                process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
            ],
            queue: QUEUES.SEARCH_INDEXING,
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3001;
    await app.listen(port);
}
void bootstrap();

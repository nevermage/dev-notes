import { FeatureExtractionPipeline, pipeline } from '@huggingface/transformers';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class EmbeddingService implements OnModuleInit {
    private extractor: FeatureExtractionPipeline;
    constructor(private readonly logger: PinoLogger) {}

    async onModuleInit() {
        this.logger.debug('Loading embedding model');

        this.extractor = await pipeline(
            'feature-extraction',
            'nomic-ai/nomic-embed-text-v1.5',
        );

        this.logger.debug('Embedding model has been loaded');
    }

    async generate(text: string, isQuery = false): Promise<number[]> {
        const prefix = isQuery ? 'search_query: ' : 'search_document: ';
        const fullText = `${prefix}${text}`;

        const output = await this.extractor(fullText, {
            pooling: 'mean',
            normalize: true,
        });

        return Array.from(output.data as Float32Array);
    }
}

import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../notes/db/schema';

@Global()
@Module({
    providers: [
        {
            provide: 'DRIZZLE_CONNECTION',
            useFactory: () => {
                const pool = new Pool({
                    connectionString: process.env.DATABASE_URL,
                });
                return drizzle(pool, { schema });
            },
        },
    ],
    exports: ['DRIZZLE_CONNECTION'],
})
export class DatabaseModule {}

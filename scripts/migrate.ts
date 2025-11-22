import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set. This is required for migrations.');
    process.exit(1);
}

// Only require SSL if we are connecting to a Neon database.
const sslOptions = databaseUrl.includes('neon.tech') ? { ssl: 'require' as const } : {};

// Create a dedicated client for the migration.
const migrationClient = postgres(databaseUrl, { ...sslOptions, max: 1 });
const db = drizzle(migrationClient);

const main = async () => {
    try {
        console.log(`Starting database migration...`);
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await migrationClient.end();
        process.exit(0);
    }
};

main();

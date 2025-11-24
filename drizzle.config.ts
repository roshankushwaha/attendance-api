import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema/index.ts',
    out: './drizzle',
    dbCredentials:{
        url: "postgresql://neondb_owner:npg_ElPK2iQt8onT@ep-bold-queen-a191na0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
        ssl: {
            rejectUnauthorized: false
        }
    }
})
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index";
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_ElPK2iQt8onT@ep-bold-queen-a191na0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: {
        rejectUnauthorized: false
    }
})

export const db = drizzle(pool, { schema })
import { date, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const attendanceRecord = pgTable('attendance_record', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    date: date('date').notNull(),
    punchIn: timestamp('punch_in'),
    punchOut: timestamp('punch_out'),
    deviceId: text('device_id').notNull()
}, table => [unique().on(table.userId, table.date)]);
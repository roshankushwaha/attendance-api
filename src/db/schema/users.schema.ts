import { pgTable, uuid, varchar, boolean, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: varchar('first_name').notNull(),
    lastName: varchar('last_name'),

    email: varchar('email'),
    contact: varchar('contact').notNull().unique(),
    
    password: text('password').notNull(),
    role: varchar('role', { length: 20 }).notNull(),

    active: boolean('active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})
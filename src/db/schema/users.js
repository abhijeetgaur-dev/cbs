import { pgTable, uuid, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['principal', 'teacher']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const contentSlots = pgTable('content_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacherId: uuid('teacher_id')
    .notNull()
    .references(() => users.id),
  subject: varchar('subject', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

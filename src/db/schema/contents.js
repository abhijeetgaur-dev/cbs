import { pgTable, uuid, varchar, text, integer, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const contentStatusEnum = pgEnum('status', ['pending', 'approved', 'rejected']);

export const contents = pgTable('contents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  subject: varchar('subject', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 1024 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  uploadedBy: uuid('uploaded_by')
    .notNull()
    .references(() => users.id),
  status: contentStatusEnum('status').default('pending').notNull(),
  rejectionReason: text('rejection_reason'),
  approvedBy: uuid('approved_by')
    .references(() => users.id),
  approvedAt: timestamp('approved_at'),
  startTime: timestamp('start_time'),
  duration: integer('duration'),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
});

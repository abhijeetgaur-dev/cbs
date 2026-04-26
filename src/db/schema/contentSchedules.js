import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { contents } from './contents.js';
import { contentSlots } from './contentSlots.js';

export const contentSchedules = pgTable('content_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id')
    .notNull()
    .references(() => contents.id),
  slotId: uuid('slot_id')
    .notNull()
    .references(() => contentSlots.id),
  rotationOrder: integer('rotation_order').notNull(),
  duration: integer('duration').default(5).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { contents } from '../db/schema/contents.js';
import { contentSlots } from '../db/schema/contentSlots.js';
import { contentSchedules } from '../db/schema/contentSchedules.js';

export const getPendingContents = async () => {
  return await db.select().from(contents).where(eq(contents.status, 'pending'));
};

export const getAllContents = async () => {
  return await db.select().from(contents);
};

export const approveContent = async (contentId, principalId) => {
  // Fetch content
  const [content] = await db.select().from(contents).where(eq(contents.id, contentId));
  if (!content) throw { status: 404, message: 'Content not found' };
  if (content.status !== 'pending') throw { status: 400, message: 'Content is not pending' };

  // Update content status
  const [approvedContent] = await db.update(contents)
    .set({
      status: 'approved',
      approvedBy: principalId,
      approvedAt: new Date()
    })
    .where(eq(contents.id, contentId))
    .returning();

  // Find or create slot
  let [slot] = await db.select()
    .from(contentSlots)
    .where(and(
      eq(contentSlots.teacherId, content.uploadedBy),
      eq(contentSlots.subject, content.subject)
    ));

  if (!slot) {
    [slot] = await db.insert(contentSlots)
      .values({ teacherId: content.uploadedBy, subject: content.subject })
      .returning();
  }

  // Find max rotation order
  const highestSchedule = await db.select()
    .from(contentSchedules)
    .where(eq(contentSchedules.slotId, slot.id))
    .orderBy(desc(contentSchedules.rotationOrder))
    .limit(1);

  const nextRotationOrder = highestSchedule.length > 0 ? highestSchedule[0].rotationOrder + 1 : 1;

  // Insert into schedules
  await db.insert(contentSchedules).values({
    contentId: content.id,
    slotId: slot.id,
    rotationOrder: nextRotationOrder,
    duration: content.duration || 5,
  });

  return approvedContent;
};

export const rejectContent = async (contentId, principalId, reason) => {
  const [content] = await db.select().from(contents).where(eq(contents.id, contentId));
  if (!content) throw { status: 404, message: 'Content not found' };
  if (content.status !== 'pending') throw { status: 400, message: 'Content is not pending' };

  const [rejectedContent] = await db.update(contents)
    .set({
      status: 'rejected',
      rejectionReason: reason
    })
    .where(eq(contents.id, contentId))
    .returning();

  return rejectedContent;
};

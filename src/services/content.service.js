import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { contents } from '../db/schema/contents.js';

export const uploadContent = async ({ title, subject, description, start_time, end_time, duration }, fileData, uploadedById) => {
  const [newContent] = await db.insert(contents).values({
    title,
    subject,
    description: description || null,
    filePath: fileData.location,
    fileType: fileData.mimetype,
    fileSize: fileData.size,
    uploadedBy: uploadedById,
    status: 'pending',
    duration: duration || null,
    startTime: start_time ? new Date(start_time) : null,
    endTime: end_time ? new Date(end_time) : null,
  }).returning();

  return newContent;
};

export const getMyContent = async (userId) => {
  const userContents = await db.select().from(contents).where(eq(contents.uploadedBy, userId));
  return userContents;
};

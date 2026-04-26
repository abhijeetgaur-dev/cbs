import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { contents } from '../db/schema/contents.js';
import { contentSchedules } from '../db/schema/contentSchedules.js';
import { contentSlots } from '../db/schema/contentSlots.js';
import { getActiveContent } from '../services/scheduling.service.js';

export const getLiveContent = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;

    let baseConditions = [
      eq(contents.uploadedBy, teacherId),
      eq(contents.status, 'approved')
    ];

    let filterConditions = [];

    if (subject) {
      filterConditions.push(eq(contents.subject, subject));
    }

    const results = await db.select({
      contents: contents,
      content_schedules: contentSchedules,
      content_slots: contentSlots
    })
    .from(contents)
    .innerJoin(contentSchedules, eq(contents.id, contentSchedules.contentId))
    .innerJoin(contentSlots, eq(contentSchedules.slotId, contentSlots.id))
    .where(and(... baseConditions, ...filterConditions));

    if (results.length === 0) {
      return res.status(200).json({ message: "No content available" });
    }

    const activeContent = getActiveContent(results, Date.now());

    if (!activeContent) {
      return res.status(200).json({ message: "No content available" });
    }

    return res.status(200).json({
      title: activeContent.title,
      subject: activeContent.subject,
      description: activeContent.description,
      file_url: activeContent.filePath
    });

  } catch (error) {
    console.error('Broadcast live fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

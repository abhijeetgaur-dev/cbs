export const getActiveContent = (contentsWithSchedules, nowMs) => {
  if (!contentsWithSchedules || contentsWithSchedules.length === 0) {
    return null;
  }

  // Step 1: Filter by time window if start_time / end_time exists
  const now = new Date(nowMs);
  const activeWindows = contentsWithSchedules.filter(item => {

    if (item.contents.startTime && now < item.contents.startTime) return false;
    if (item.contents.endTime && now > item.contents.endTime) return false;
    return true;
  });

  if (activeWindows.length === 0) {
    return null;
  }
 

  if (activeWindows.length === 1) {
    return activeWindows[0].contents;
  }

  // Sort by rotation_order ascending
  activeWindows.sort((a, b) => a.content_schedules.rotationOrder - b.content_schedules.rotationOrder);

  // Calculate total cycle duration
  const totalCycle = activeWindows.reduce((acc, item) => acc + item.content_schedules.duration, 0);

  // Calculate elapsed time from midnight today
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  
  const elapsedMs = nowMs - midnight.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  // Find position in current cycle
  const position = elapsedMinutes % totalCycle;

  //  Walk the list to find active slot
  let cursor = 0;
  for (const item of activeWindows) {
    cursor += item.content_schedules.duration;
    if (position < cursor) {
      return item.contents;
    }
  }

  return null; // Fallback
};

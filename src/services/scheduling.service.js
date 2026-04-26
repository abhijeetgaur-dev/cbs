export const getActiveContent = (contentsWithSchedules, nowMs) => {
  if (!contentsWithSchedules || contentsWithSchedules.length === 0) {
    return null;
  }

  // Step 1: Filter by time window — compare as ms to avoid type ambiguity
  const activeWindows = contentsWithSchedules.filter(item => {
    const start = item.contents.startTime
      ? new Date(item.contents.startTime).getTime()
      : null;
    const end = item.contents.endTime
      ? new Date(item.contents.endTime).getTime()
      : null;

    if (start && nowMs < start) return false;
    if (end && nowMs > end) return false;
    return true;
  });

  // Step 2: Nothing is within its time window
  if (activeWindows.length === 0) return null;

  // Step 3: Only one item — no rotation math needed
  if (activeWindows.length === 1) return activeWindows[0].contents;

  // Step 4: Sort by rotation order ascending
  activeWindows.sort(
    (a, b) => a.content_schedules.rotationOrder - b.content_schedules.rotationOrder
  );

  // Step 5: Total cycle duration in minutes
  const totalCycle = activeWindows.reduce(
    (acc, item) => acc + item.content_schedules.duration, 0
  );

  // Step 6: Elapsed minutes since midnight (rotation resets daily)
  const midnight = new Date(nowMs);
  midnight.setHours(0, 0, 0, 0);
  const elapsedMinutes = Math.floor((nowMs - midnight.getTime()) / 60000);

  // Step 7: Position within the current cycle
  const position = elapsedMinutes % totalCycle;

  // Step 8: Walk the list to find which slot is active
  let cursor = 0;
  for (const item of activeWindows) {
    cursor += item.content_schedules.duration;
    if (position < cursor) return item.contents;
  }

  // Safe fallback
  return activeWindows[activeWindows.length - 1].contents;
};
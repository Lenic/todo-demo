export function getEvent() {
  try {
    return useRequestEvent() ?? useEvent();
  } catch {
    try {
      return useEvent();
    } catch {
      throw new Error('[Request Event]: can not find the event.');
    }
  }
}

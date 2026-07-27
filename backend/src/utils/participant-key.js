export function participantKey(ids) {
  const normalized = [...new Set(ids.map(Number))].sort((a, b) => a - b);
  return normalized.join(":");
}

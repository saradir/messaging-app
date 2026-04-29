export function formatTime(timestamp) {
  if (!timestamp) return "";
  
  const date = new Date(timestamp);
  
  // Using 'en-GB' for 24-hour format (HH:mm)
  // Or 'en-US' if you prefer 12-hour (9:05 AM)
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
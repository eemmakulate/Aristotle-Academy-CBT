export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeRemaining(seconds: number): {
  formatted: string;
  isUrgent: boolean;
  isCritical: boolean;
} {
  const formatted = formatSeconds(Math.max(0, seconds));
  const isUrgent = seconds <= 300 && seconds > 60; // 5 mins
  const isCritical = seconds <= 60; // 1 min
  return { formatted, isUrgent, isCritical };
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

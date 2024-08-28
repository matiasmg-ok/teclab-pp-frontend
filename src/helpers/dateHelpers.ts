export function isToday(date: string | Date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const today = new Date();

  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
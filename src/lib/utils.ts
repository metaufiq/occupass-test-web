import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateAPI = (dateString?: string) => {
if (!dateString) return 'N/A';
// Extract the timestamp from the date string
const data = dateString.match(/\d+/)?.[0]
if (!data) return 'N/A';
const timestamp = parseInt(data, 10);
const date = new Date(timestamp);

return date.toLocaleDateString();
}

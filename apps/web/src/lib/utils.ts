import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Fetcher } from '@/types/interface/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher: Fetcher = (url, options) =>
  fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
  }).then((r) => r.json());

export function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const months = Math.floor(diff / 1000 / 60 / 60 / 24 / 30);
  const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 365);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function convertEmptyStringsToUndefined<
  T extends Record<string, unknown>,
>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === '' ? undefined : value,
    ])
  ) as T;
}

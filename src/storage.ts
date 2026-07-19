import type { AppData } from './types';

const KEY = 'quit-app-data-v1';

const EMPTY: AppData = { profile: null, cravings: [] };

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      profile: parsed.profile ?? null,
      cravings: Array.isArray(parsed.cravings) ? parsed.cravings : [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearData(): void {
  localStorage.removeItem(KEY);
}

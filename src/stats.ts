import type { AppData, CravingEvent, Profile } from './types';

export interface Stats {
  /** Milliseconds since the last cigarette (last slip, or quit date) */
  smokeFreeMs: number;
  /** Milliseconds since the original quit date */
  sinceQuitMs: number;
  /** Cigarettes avoided = expected consumption minus slips */
  cigsAvoided: number;
  moneySaved: number;
  slipCount: number;
  resistedCount: number;
  /** Fraction of logged cravings that were resisted, or null if none logged */
  resistRate: number | null;
}

export function lastSmokeTime(profile: Profile, cravings: CravingEvent[]): number {
  const quit = new Date(profile.quitDate).getTime();
  const slips = cravings
    .filter((c) => c.outcome === 'slipped')
    .map((c) => new Date(c.at).getTime())
    .filter((t) => t > quit);
  return slips.length ? Math.max(...slips) : quit;
}

export function computeStats(data: AppData, now: number = Date.now()): Stats | null {
  const { profile, cravings } = data;
  if (!profile) return null;

  const quit = new Date(profile.quitDate).getTime();
  const sinceQuitMs = Math.max(0, now - quit);
  const smokeFreeMs = Math.max(0, now - lastSmokeTime(profile, cravings));

  const slipCount = cravings.filter((c) => c.outcome === 'slipped').length;
  const resistedCount = cravings.filter((c) => c.outcome === 'resisted').length;

  const expectedCigs = (sinceQuitMs / 86_400_000) * profile.cigsPerDay;
  const cigsAvoided = Math.max(0, expectedCigs - slipCount);
  const pricePerCig = profile.cigsPerPack > 0 ? profile.pricePerPack / profile.cigsPerPack : 0;

  const logged = slipCount + resistedCount;

  return {
    smokeFreeMs,
    sinceQuitMs,
    cigsAvoided,
    moneySaved: cigsAvoided * pricePerCig,
    slipCount,
    resistedCount,
    resistRate: logged > 0 ? resistedCount / logged : null,
  };
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDurationLong(ms: number): { value: string; unit: string } {
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  if (days >= 1) return { value: String(days), unit: days === 1 ? 'day' : 'days' };
  const hours = Math.floor(totalMinutes / 60);
  if (hours >= 1) return { value: String(hours), unit: hours === 1 ? 'hour' : 'hours' };
  return { value: String(totalMinutes), unit: totalMinutes === 1 ? 'minute' : 'minutes' };
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

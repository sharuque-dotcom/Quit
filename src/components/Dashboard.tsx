import { useEffect, useState } from 'react';
import type { AppData } from '../types';
import { computeStats, formatDuration, formatDurationLong, formatMoney } from '../stats';
import { MILESTONES } from '../milestones';

interface Props {
  data: AppData;
}

export default function Dashboard({ data }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const stats = computeStats(data, now);
  if (!stats || !data.profile) return null;

  const smokeFree = formatDurationLong(stats.smokeFreeMs);
  const smokeFreeMinutes = stats.smokeFreeMs / 60_000;

  const nextMilestone = MILESTONES.find((m) => m.minutes > smokeFreeMinutes);
  const reached = MILESTONES.filter((m) => m.minutes <= smokeFreeMinutes);
  const latestReached = reached[reached.length - 1];
  const hadSlips = stats.slipCount > 0;

  return (
    <div className="dashboard">
      <section className="hero card">
        <div className="hero-timer">
          <span className="hero-value">{smokeFree.value}</span>
          <span className="hero-unit">{smokeFree.unit} smoke-free</span>
        </div>
        {hadSlips && (
          <p className="hero-subnote">
            {formatDuration(stats.sinceQuitMs)} on this journey · {stats.slipCount}{' '}
            {stats.slipCount === 1 ? 'slip' : 'slips'} — none of your progress is erased.
          </p>
        )}
      </section>

      <section className="stat-grid">
        <div className="card stat">
          <span className="stat-value">{formatMoney(stats.moneySaved, data.profile.currency)}</span>
          <span className="stat-label">saved</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{Math.floor(stats.cigsAvoided)}</span>
          <span className="stat-label">cigarettes not smoked</span>
        </div>
        <div className="card stat">
          <span className="stat-value">{stats.resistedCount}</span>
          <span className="stat-label">cravings beaten</span>
        </div>
      </section>

      <section className="card milestones">
        <h2>Your body is healing</h2>
        {latestReached && (
          <div className="milestone reached">
            <div className="milestone-marker done" />
            <div>
              <strong>{latestReached.title}</strong>
              <p>{latestReached.detail}</p>
            </div>
          </div>
        )}
        {nextMilestone && (
          <div className="milestone next">
            <div className="milestone-marker" />
            <div>
              <span className="milestone-eta">
                in {formatDuration(nextMilestone.minutes * 60_000 - stats.smokeFreeMs)}
              </span>
              <strong>{nextMilestone.title}</strong>
              <p>{nextMilestone.detail}</p>
            </div>
          </div>
        )}
        <p className="milestone-count">
          {reached.length} of {MILESTONES.length} recovery milestones reached
        </p>
      </section>
    </div>
  );
}

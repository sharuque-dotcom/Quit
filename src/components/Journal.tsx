import type { AppData, CravingEvent } from '../types';

interface Props {
  data: AppData;
  onDelete: (id: string) => void;
}

export default function Journal({ data, onDelete }: Props) {
  const { cravings } = data;

  if (cravings.length === 0) {
    return (
      <div className="journal">
        <h1>Craving journal</h1>
        <p className="empty">
          Nothing logged yet. When a craving hits, tap the button below — riding it out for three
          minutes is usually all it takes, and logging it teaches you your triggers.
        </p>
      </div>
    );
  }

  const triggerCounts = new Map<string, number>();
  for (const c of cravings) {
    if (c.trigger) triggerCounts.set(c.trigger, (triggerCounts.get(c.trigger) ?? 0) + 1);
  }
  const topTriggers = [...triggerCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = topTriggers[0]?.[1] ?? 1;

  return (
    <div className="journal">
      <h1>Craving journal</h1>

      {topTriggers.length > 0 && (
        <section className="card">
          <h2>Your top triggers</h2>
          <ul className="trigger-freq">
            {topTriggers.map(([name, count]) => (
              <li key={name}>
                <span className="trigger-name">{name}</span>
                <span className="trigger-bar-track">
                  <span className="trigger-bar" style={{ width: `${(count / maxCount) * 100}%` }} />
                </span>
                <span className="trigger-count">{count}</span>
              </li>
            ))}
          </ul>
          <p className="hint">
            Knowing your triggers lets you plan for them — change the routine, not just resist it.
          </p>
        </section>
      )}

      <section className="card">
        <h2>History</h2>
        <ul className="craving-list">
          {cravings.map((c) => (
            <CravingRow key={c.id} craving={c} onDelete={onDelete} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function CravingRow({ craving, onDelete }: { craving: CravingEvent; onDelete: (id: string) => void }) {
  const when = new Date(craving.at).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  return (
    <li className={`craving-row ${craving.outcome}`}>
      <span className="craving-outcome">{craving.outcome === 'resisted' ? 'Rode it out' : 'Slipped'}</span>
      <span className="craving-meta">
        {when}
        {craving.trigger ? ` · ${craving.trigger}` : ''} · intensity {craving.intensity}/5
      </span>
      <button className="btn-ghost small" onClick={() => onDelete(craving.id)} aria-label="Delete entry">
        ✕
      </button>
    </li>
  );
}

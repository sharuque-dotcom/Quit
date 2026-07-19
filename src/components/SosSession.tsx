import { useEffect, useRef, useState } from 'react';
import type { CravingEvent, CravingOutcome } from '../types';
import { TRIGGERS } from '../types';

interface Props {
  /** Called with the logged craving, or null if the user backed out */
  onFinish: (event: CravingEvent | null) => void;
}

type Phase = 'intro' | 'breathe' | 'log';

const SESSION_SECONDS = 180;
const INHALE_S = 4;
const HOLD_S = 2;
const EXHALE_S = 6;
const CYCLE_S = INHALE_S + HOLD_S + EXHALE_S;

export default function SosSession({ onFinish }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const startedAt = useRef(new Date().toISOString());

  useEffect(() => {
    if (phase !== 'breathe') return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setPhase('log');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  if (phase === 'intro') {
    return (
      <div className="sos">
        <h1>This craving will pass.</h1>
        <p>
          A craving is a wave — it rises, peaks, and fades in about 3–5 minutes, whether or not you
          smoke. You only need to outlast this one wave, not the whole ocean.
        </p>
        <p>Let's breathe through it together for three minutes.</p>
        <button className="btn-primary" onClick={() => setPhase('breathe')}>
          Start breathing
        </button>
        <button className="btn-ghost" onClick={() => setPhase('log')}>
          Skip to logging
        </button>
        <button className="btn-ghost" onClick={() => onFinish(null)}>
          Close
        </button>
      </div>
    );
  }

  if (phase === 'breathe') {
    const elapsed = SESSION_SECONDS - secondsLeft;
    const inCycle = elapsed % CYCLE_S;
    const stage =
      inCycle < INHALE_S ? 'Breathe in' : inCycle < INHALE_S + HOLD_S ? 'Hold' : 'Breathe out';
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    return (
      <div className="sos">
        <div className={`breath-circle ${stage === 'Breathe in' ? 'grow' : stage === 'Hold' ? 'hold' : 'shrink'}`}>
          <span>{stage}</span>
        </div>
        <p className="sos-countdown">
          {minutes}:{seconds}
        </p>
        <p className="sos-hint">Ride the wave. It's already fading.</p>
        <button className="btn-ghost" onClick={() => setPhase('log')}>
          I'm okay now
        </button>
      </div>
    );
  }

  return <LogForm startedAt={startedAt.current} onFinish={onFinish} />;
}

function LogForm({ startedAt, onFinish }: { startedAt: string; onFinish: Props['onFinish'] }) {
  const [outcome, setOutcome] = useState<CravingOutcome | null>(null);
  const [trigger, setTrigger] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);

  const save = () => {
    if (!outcome) return;
    onFinish({
      id: crypto.randomUUID(),
      at: startedAt,
      outcome,
      trigger,
      intensity,
    });
  };

  return (
    <div className="sos sos-log">
      <h1>How did it go?</h1>

      <div className="outcome-row">
        <button
          className={`outcome-btn ${outcome === 'resisted' ? 'selected' : ''}`}
          onClick={() => setOutcome('resisted')}
        >
          I rode it out
        </button>
        <button
          className={`outcome-btn slip ${outcome === 'slipped' ? 'selected' : ''}`}
          onClick={() => setOutcome('slipped')}
        >
          I smoked
        </button>
      </div>

      {outcome === 'slipped' && (
        <p className="slip-note">
          A slip is a data point, not a verdict. Most successful quitters slip along the way — what
          matters is the next craving, and you'll be readier for it.
        </p>
      )}

      <h2>What set it off?</h2>
      <div className="trigger-chips">
        {TRIGGERS.map((t) => (
          <button
            key={t}
            className={`chip ${trigger === t ? 'selected' : ''}`}
            onClick={() => setTrigger(trigger === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>

      <h2>How strong was it?</h2>
      <div className="intensity-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`chip ${intensity === n ? 'selected' : ''}`}
            onClick={() => setIntensity(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button className="btn-primary" disabled={!outcome} onClick={save}>
        Save
      </button>
      <button className="btn-ghost" onClick={() => onFinish(null)}>
        Discard
      </button>
    </div>
  );
}

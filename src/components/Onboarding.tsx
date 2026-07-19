import { useState } from 'react';
import type { Profile } from '../types';

const CURRENCIES = ['USD', 'AED', 'EUR', 'GBP', 'INR', 'SAR', 'PKR', 'PHP'];

interface Props {
  onComplete: (profile: Profile) => void;
}

function toLocalInputValue(date: Date): string {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60_000).toISOString().slice(0, 16);
}

export default function Onboarding({ onComplete }: Props) {
  const [quitDate, setQuitDate] = useState(() => toLocalInputValue(new Date()));
  const [cigsPerDay, setCigsPerDay] = useState('15');
  const [cigsPerPack, setCigsPerPack] = useState('20');
  const [pricePerPack, setPricePerPack] = useState('10');
  const [currency, setCurrency] = useState('USD');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      quitDate: new Date(quitDate).toISOString(),
      cigsPerDay: Math.max(1, Number(cigsPerDay) || 1),
      cigsPerPack: Math.max(1, Number(cigsPerPack) || 20),
      pricePerPack: Math.max(0, Number(pricePerPack) || 0),
      currency,
    });
  };

  return (
    <div className="onboarding">
      <div className="onboarding-hero">
        <h1>You're becoming a non-smoker.</h1>
        <p>
          Not "trying to quit" — becoming someone who doesn't smoke. Cravings will come, each one
          lasts only a few minutes, and this app will help you ride every single one out.
        </p>
      </div>

      <form onSubmit={submit} className="card">
        <label>
          When is (or was) your last cigarette?
          <input
            type="datetime-local"
            value={quitDate}
            max={toLocalInputValue(new Date())}
            onChange={(e) => setQuitDate(e.target.value)}
            required
          />
        </label>

        <label>
          How many cigarettes did you smoke per day?
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            value={cigsPerDay}
            onChange={(e) => setCigsPerDay(e.target.value)}
            required
          />
        </label>

        <div className="field-row">
          <label>
            Cigarettes per pack
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="50"
              value={cigsPerPack}
              onChange={(e) => setCigsPerPack(e.target.value)}
              required
            />
          </label>
          <label>
            Price per pack
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={pricePerPack}
              onChange={(e) => setPricePerPack(e.target.value)}
              required
            />
          </label>
          <label>
            Currency
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" className="btn-primary">
          Start my smoke-free life
        </button>
      </form>

      <p className="onboarding-footnote">
        Everything stays on your device. No account, no tracking.
      </p>
    </div>
  );
}

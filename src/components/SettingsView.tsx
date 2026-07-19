import { useState } from 'react';
import type { Profile } from '../types';

interface Props {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onReset: () => void;
}

export default function SettingsView({ profile, onSave, onReset }: Props) {
  const [cigsPerDay, setCigsPerDay] = useState(String(profile.cigsPerDay));
  const [cigsPerPack, setCigsPerPack] = useState(String(profile.cigsPerPack));
  const [pricePerPack, setPricePerPack] = useState(String(profile.pricePerPack));
  const [currency, setCurrency] = useState(profile.currency);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      cigsPerDay: Math.max(1, Number(cigsPerDay) || profile.cigsPerDay),
      cigsPerPack: Math.max(1, Number(cigsPerPack) || profile.cigsPerPack),
      pricePerPack: Math.max(0, Number(pricePerPack) || 0),
      currency: currency.trim().toUpperCase() || profile.currency,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <form onSubmit={save} className="card">
        <label>
          Cigarettes per day (before quitting)
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={cigsPerDay}
            onChange={(e) => setCigsPerDay(e.target.value)}
          />
        </label>
        <div className="field-row">
          <label>
            Cigarettes per pack
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={cigsPerPack}
              onChange={(e) => setCigsPerPack(e.target.value)}
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
            />
          </label>
          <label>
            Currency
            <input
              value={currency}
              maxLength={3}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="btn-primary">
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>

      <div className="card danger-zone">
        <h2>Start over</h2>
        <p>Deletes your profile and all logged cravings from this device.</p>
        {confirmReset ? (
          <div className="field-row">
            <button className="btn-danger" onClick={onReset}>
              Yes, delete everything
            </button>
            <button className="btn-ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn-ghost" onClick={() => setConfirmReset(true)}>
            Reset all data…
          </button>
        )}
      </div>

      <p className="hint">All data lives in your browser's local storage. Nothing leaves your device.</p>
    </div>
  );
}

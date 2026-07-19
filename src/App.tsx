import { useEffect, useState } from 'react';
import type { AppData, CravingEvent, Profile } from './types';
import { loadData, saveData, clearData } from './storage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import SosSession from './components/SosSession';
import Journal from './components/Journal';
import SettingsView from './components/SettingsView';

type View = 'home' | 'journal' | 'settings';

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [view, setView] = useState<View>('home');
  const [sosOpen, setSosOpen] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const setProfile = (profile: Profile) => setData((d) => ({ ...d, profile }));

  const addCraving = (event: CravingEvent) =>
    setData((d) => ({ ...d, cravings: [event, ...d.cravings] }));

  const deleteCraving = (id: string) =>
    setData((d) => ({ ...d, cravings: d.cravings.filter((c) => c.id !== id) }));

  const reset = () => {
    clearData();
    setData({ profile: null, cravings: [] });
    setView('home');
  };

  if (!data.profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  if (sosOpen) {
    return (
      <SosSession
        onFinish={(event) => {
          if (event) addCraving(event);
          setSosOpen(false);
        }}
      />
    );
  }

  return (
    <div className="app">
      <main className="app-main">
        {view === 'home' && <Dashboard data={data} />}
        {view === 'journal' && <Journal data={data} onDelete={deleteCraving} />}
        {view === 'settings' && (
          <SettingsView profile={data.profile} onSave={setProfile} onReset={reset} />
        )}
      </main>

      <button className="sos-fab" onClick={() => setSosOpen(true)}>
        Craving? Take a break
      </button>

      <nav className="tabbar">
        <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>
          Home
        </button>
        <button className={view === 'journal' ? 'active' : ''} onClick={() => setView('journal')}>
          Journal
        </button>
        <button
          className={view === 'settings' ? 'active' : ''}
          onClick={() => setView('settings')}
        >
          Settings
        </button>
      </nav>
    </div>
  );
}

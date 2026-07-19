# Quit — a smoke-free companion

A quit-smoking web app built around one idea: **the hardest part of quitting is a 3–5 minute
craving wave, and a cigarette break was never just about nicotine.**

Everything runs in the browser and stays on the device — no account, no server, no tracking.

## The psychology it's built on

- **Cravings are short waves.** They rise, peak, and fade in a few minutes whether or not you
  smoke. The app's centerpiece is a full-screen, 5-minute "take a break" ritual with paced
  breathing timed like a cigarette's drag rhythm — it replaces the pause and the ritual, not
  just the willpower.
- **Slips aren't failure.** The "abstinence violation effect" (one slip → "I've blown it" →
  full relapse) kills more quit attempts than the slip itself. The smoke-free clock restarts
  after a slip because that's physiologically honest, but money saved, milestones reached,
  and total journey time are never zeroed out — and the copy never shames.
- **Triggers are learnable.** Each craving is logged with its trigger and intensity; the
  journal surfaces your personal trigger pattern so you can change the routine, not just
  resist it.
- **Progress should be visible.** A health-recovery timeline (heart rate at 20 minutes,
  carbon monoxide at 12 hours, up to 15 years) plus money saved and cigarettes avoided make
  an invisible process concrete.
- **Identity beats willpower.** The app's language treats you as a non-smoker who is
  recovering, not a smoker who is abstaining.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

The app is installable as a PWA (manifest + icon included). State persists in
`localStorage` under the key `quit-app-data-v1`.

## Structure

- `src/App.tsx` — shell: onboarding gate, tab navigation, break-ritual overlay
- `src/components/Onboarding.tsx` — quit date, consumption, and price setup
- `src/components/Dashboard.tsx` — smoke-free clock, savings, health milestones
- `src/components/SosSession.tsx` — the 5-minute break ritual + craving log
- `src/components/Journal.tsx` — craving history and trigger frequency
- `src/components/SettingsView.tsx` — profile edits and data reset
- `src/stats.ts` — lapse-aware derived stats
- `src/milestones.ts` — health recovery timeline data

## Roadmap (phase 2, not built yet)

- **The Quit Room** — inspired by Korean "dopamine site" virtual smoking rooms: an
  anonymous, ambient space showing how many people are riding out a craving right now, with
  ephemeral one-line notes ("day 3, brutal, still here"). No profiles, no chat, no likes;
  sessions time-boxed to the craving. Requires a lightweight presence backend.
- **Trigger prediction** — use the logged craving fingerprint to warn ahead of high-risk
  windows (needs notifications, so likely a native wrapper or PWA push).
- **Message from your past self** — record a voice memo while motivated; play it back
  mid-craving.
- **Savings goals** — attach the money saved to a concrete reward.

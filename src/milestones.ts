export interface Milestone {
  /** Time smoke-free required, in minutes */
  minutes: number;
  title: string;
  detail: string;
}

const H = 60;
const D = 24 * H;

/**
 * Health recovery timeline, based on widely published figures from the
 * WHO, US Surgeon General, and NHS. Milestones are measured from the last
 * cigarette (not the original quit date), because the body's recovery
 * clock restarts with nicotine and carbon monoxide exposure.
 */
export const MILESTONES: Milestone[] = [
  {
    minutes: 20,
    title: 'Heart rate settles',
    detail: 'Your heart rate and blood pressure drop back toward normal.',
  },
  {
    minutes: 12 * H,
    title: 'Carbon monoxide clears',
    detail: 'The carbon monoxide level in your blood returns to normal, so your blood carries oxygen properly again.',
  },
  {
    minutes: 24 * H,
    title: 'Heart attack risk starts falling',
    detail: 'Your risk of a heart attack already begins to decrease.',
  },
  {
    minutes: 2 * D,
    title: 'Taste and smell return',
    detail: 'Nerve endings start to regrow. Food tastes better; smells are sharper.',
  },
  {
    minutes: 3 * D,
    title: 'Breathing gets easier',
    detail: 'Bronchial tubes relax and energy rises. The worst of nicotine withdrawal is usually behind you.',
  },
  {
    minutes: 14 * D,
    title: 'Circulation improves',
    detail: 'Walking and exercise feel noticeably easier as circulation recovers.',
  },
  {
    minutes: 30 * D,
    title: 'Lungs work better',
    detail: 'Lung function measurably improves; coughing and shortness of breath decline.',
  },
  {
    minutes: 90 * D,
    title: 'Lung cleaning restored',
    detail: 'Cilia in your lungs regrow, clearing mucus and reducing infection risk.',
  },
  {
    minutes: 365 * D,
    title: 'Heart disease risk halved',
    detail: 'Your excess risk of coronary heart disease is about half that of a smoker.',
  },
  {
    minutes: 5 * 365 * D,
    title: 'Stroke risk normalized',
    detail: 'Your stroke risk can fall to that of someone who never smoked.',
  },
  {
    minutes: 10 * 365 * D,
    title: 'Lung cancer risk halved',
    detail: 'Your risk of dying from lung cancer is about half that of a smoker.',
  },
  {
    minutes: 15 * 365 * D,
    title: 'Full circle',
    detail: 'Your risk of coronary heart disease matches that of a lifelong non-smoker.',
  },
];

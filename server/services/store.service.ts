import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const DEFAULT_TOURNAMENTS = [
  {
    id: 'pubg-tva-xlantis-2026',
    gameId: 'pubg',
    status: 'completed',
    title: 'PUBG – Powered by TVA & Xlantis',
    subtitle: 'India Squads Open',
    year: '2026',
    prizePool: '₹1,00,000',
    format: 'Squads (4v4)',
    region: 'India',
    teams: 32,
    winner: 'Team Danjaar',
    winnerLogo: '/images/danjaar_logo.png',
    color: '#f4a023',
    colorRgb: '244,160,35',
    qualifiers: {
      dates: ['April 19, 2026 (Sunday) – Groups A vs B', 'April 20, 2026 (Monday) – Groups C vs D'],
      time: '22:30 IST',
      format: '32 teams → 4 groups of 8 → Top 8/day qualify to finals',
      matchesPerDay: 5,
    },
    finals: {
      date: 'April 21, 2026 (Tuesday)',
      time: '22:30 IST',
      teams: 16,
      matches: 5,
      maps: ['Erangel', 'Miramar', 'Taego', 'Rondo'],
    },
    platforms: ['eWave.gg', 'Squad One Elite Battlegrounds Discord', 'eWave.gg Discord'],
    prizes: [
      { place: '1st Place', icon: '🥇', amount: '₹40,000' },
      { place: '2nd Place', icon: '🥈', amount: '₹30,000' },
      { place: '3rd Place', icon: '🥉', amount: '₹20,000' },
      { place: 'Top Kill', icon: '🔫', amount: '₹10,000' },
    ],
    antiCheat: 'eWave AntiCheat System',
  },
  {
    id: 'gta-tva-grand-prix-2026',
    gameId: 'gta',
    status: 'upcoming',
    title: 'GTA RP – Powered by TVA & Xlantis',
    subtitle: 'Xlantis City PVP Tournament',
    year: '2026',
    prizePool: '₹1,00,000',
    format: 'Crew Racing',
    region: 'Xlantis City',
    teams: 16,
    color: '#00aaff',
    colorRgb: '0,170,255',
    partnerLogo: '/images/xlantis_logo.png',
    partnerName: 'Xlantis City',
    registrationOpen: true,
    qualifiers: {
      dates: ['August 8, 2026 (Saturday) – Heats A & B', 'August 9, 2026 (Sunday) – Heats C & D'],
      time: '21:00 IST',
      format: '16 crews → 4 heats of 4 → Top 2/heat advance to finals',
      matchesPerDay: 2,
    },
    finals: {
      date: 'August 10, 2026 (Monday)',
      time: '21:00 IST',
      teams: 8,
      matches: 3,
      maps: ['Los Santos Circuit', 'Highway Sprint', 'Dockyard Drift'],
    },
    platforms: [
      'Xlantis City FiveM',
      {
        label: 'Tournament Discord',
        url: 'https://discord.com/channels/1531067880676921546/1531073347939729460/1531106709907706057',
      },
    ],
    prizes: [
      { place: '1st Place', icon: '🥇', amount: '₹40,000' },
      { place: '2nd Place', icon: '🥈', amount: '₹30,000' },
      { place: '3rd Place', icon: '🥉', amount: '₹20,000' },
      { place: 'Fastest Lap', icon: '🏁', amount: '₹10,000' },
    ],
    antiCheat: 'Xlantis City Server Rules & Staff Oversight',
  },
];

function emptyStore() {
  return {
    tournaments: DEFAULT_TOURNAMENTS,
    registrations: [],
    tickets: [],
  };
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(emptyStore(), null, 2), 'utf8');
  }
}

export function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const data = JSON.parse(raw);
    return {
      tournaments: Array.isArray(data.tournaments) ? data.tournaments : DEFAULT_TOURNAMENTS,
      registrations: Array.isArray(data.registrations) ? data.registrations : [],
      tickets: Array.isArray(data.tickets) ? data.tickets : [],
    };
  } catch {
    return emptyStore();
  }
}

export function writeStore(next: any) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(next, null, 2), 'utf8');
}

export function updateStore(mutator: (s: any) => any) {
  const current = readStore();
  const next = mutator(current) || current;
  writeStore(next);
  return next;
}

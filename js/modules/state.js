import { DEFAULT_LANGUAGE } from './config.js';

// Pure State Object
export const state = {
  deck: [],
  players: [],
  revealIndex: 0,
  revealComplete: false,
  customNames: [],
  activeSpecialIds: [],
  narratorDay: 1,
  maxDays: 1,
  eliminatedPlayers: [],
  guideSteps: [],
  guideStepIndex: 0,
  victory: null,
  playersCollapsed: false,
  rolesDetailsOpen: false,
  guideExpanded: true,
  language: DEFAULT_LANGUAGE,
  view: "setup",
  mythStatus: null,
  handoffCountdown: 0,
  playerVotes: {},
  benvenutoPlayer: null,
  assignedRole: null, // For clients: stores their assigned role data
  connectionStatus: 'disconnected', // For clients: 'connected' | 'reconnecting' | 'disconnected'
  hapticsEnabled: true,
};
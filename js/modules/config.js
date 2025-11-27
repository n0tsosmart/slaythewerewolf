// Constants & Configuration

export const MIN_PLAYERS = 5;

// UI/UX Timing Constants
export const TOAST_DURATION = 2500;
export const RIPPLE_DURATION = 500;
export const HAPTIC_VIBRATION_DURATION = 8;
export const ANIMATION_SHAKE_DURATION = 300;
export const PAGE_FADE_DURATION = 400;

export const DEFAULT_LANGUAGE = "en";
export const STORAGE_KEY = "SLAY_STATE";

export const ROLE_LIBRARY = {
  werewolf: {
    id: "werewolf",
    name: "Werewolf",
    team: "wolves",
    teamLabel: "Werewolves",
    image: "assets/cards/lupo.jpg",
    description: "Each night the wolves open their eyes together and pick a victim. They win when the pack is as numerous as the villagers.",
    locales: {
      es: {
        name: "Hombre Lobo",
        teamLabel: "Licántropos",
        description: "Cada noche los lobos abren los ojos juntos y eligen una víctima. Ganáis cuando la manada iguala o supera a los aldeanos.",
      },
      it: {
        name: "Lupo Mannaro",
        teamLabel: "Lupi Mannari",
        description: "Ogni notte i lupi aprono gli occhi insieme e scelgono una vittima. Vincete quando il branco uguaglia o supera i villici.",
      },
    },
  },
  villager: {
    id: "villager",
    name: "Villager",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/villico.jpg",
    description: "No special power: discuss, observe, and vote to expose the wolves. You win when no werewolves remain.",
    locales: {
      es: {
        name: "Aldeano",
        teamLabel: "Aldea",
        description: "Sin poderes especiales: observa, debate y vota para desenmascarar a los lobos. Ganas cuando no quedan licántropos.",
      },
      it: {
        name: "Villico",
        teamLabel: "Villaggio",
        description: "Nessun potere speciale: discuti, osserva e vota per smascherare i lupi. Vinci quando non restano lupi mannari.",
      },
    },
  },
  seer: {
    id: "seer",
    name: "Seer",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/veggente.jpg",
    description: "Each night you point at a player and learn whether they are wolf/hamster or human. Share information carefully.",
    locales: {
      es: {
        name: "Vidente",
        teamLabel: "Aldea",
        description: "Cada noche señala a un jugador y descubre si es lobo/criceto o humano. Comparte la información con cuidado.",
      },
      it: {
        name: "Veggente",
        teamLabel: "Villaggio",
        description: "Ogni notte indichi un giocatore e scopri se è lupo/criceto o umano. Condividi le informazioni con cautela.",
      },
    },
  },
  medium: {
    id: "medium",
    name: "Medium",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/medium.jpg",
    description: "From the second night on, learn whether the player lynched the previous day was a werewolf.",
    locales: {
      es: {
        name: "Médium",
        teamLabel: "Aldea",
        description: "Desde la segunda noche averiguas si el jugador linchado el día anterior era un hombre lobo.",
      },
      it: {
        name: "Medium",
        teamLabel: "Villaggio",
        description: "Dalla seconda notte scopri se il giocatore linciato il giorno precedente era un lupo mannaro.",
      },
    },
  },
  possessed: {
    id: "possessed",
    name: "Possessed",
    team: "wolves",
    teamLabel: "Ally of the Wolves",
    image: "assets/cards/indemoniato.jpg",
    description: "You are human but secretly root for the wolves without knowing who they are. Win only if the wolves dominate.",
    locales: {
      es: {
        name: "Endemoniado",
        teamLabel: "Aliado de los Lobos",
        description: "Eres humano pero apoyas en secreto a los lobos sin saber quiénes son. Solo ganas si los lobos vencen al pueblo.",
      },
      it: {
        name: "Indemoniato",
        teamLabel: "Alleato dei Lupi",
        description: "Sei umano ma tifi segretamente per i lupi senza sapere chi siano. Vinci solo se il branco domina il villaggio.",
      },
    },
  },
  bodyguard: {
    id: "bodyguard",
    name: "Bodyguard",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/guardia.jpg",
    description: "Each night before the wolves attack you protect one player. If targeted, they survive.",
    locales: {
      es: {
        name: "Guardián",
        teamLabel: "Aldea",
        description: "Cada noche, antes del ataque de los lobos, proteges a un jugador. Si lo atacan, sobrevive.",
      },
      it: {
        name: "Guardia del Corpo",
        teamLabel: "Villaggio",
        description: "Ogni notte, prima dell'attacco dei lupi, proteggi un giocatore. Se viene colpito, sopravvive.",
      },
    },
  },
  owl: {
    id: "owl",
    name: "Owl",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/gufo.jpg",
    description: "Each night you mark a suspect. That player is automatically nominated and with 20+ players dies if they are not Wolf/Hamster.",
    locales: {
      es: {
        name: "Búho",
        teamLabel: "Aldea",
        description: "Cada noche marcas a un sospechoso. Ese jugador queda nominado y con 20+ jugadores muere si no es Lobo/Criceto.",
      },
      it: {
        name: "Gufo",
        teamLabel: "Villaggio",
        description: "Ogni notte marchi un sospetto. Quel giocatore è automaticamente nominato e con 20+ giocatori muore se non è Lupo/Criceto.",
      },
    },
  },
  mason: {
    id: "mason",
    name: "Mason",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/massone.jpg",
    description: "Always in pairs: on the first night you open your eyes and recognize each other as allies.",
    locales: {
      es: {
        name: "Masón",
        teamLabel: "Aldea",
        description: "Siempre en pareja: la primera noche abrís los ojos y os reconocéis como aliados contra los lobos.",
      },
      it: {
        name: "Massone",
        teamLabel: "Villaggio",
        description: "Sempre in coppia: la prima notte aprite gli occhi e vi riconoscete come alleati contro i lupi.",
      },
    },
  },
  werehamster: {
    id: "werehamster",
    name: "Werehamster",
    team: "loner",
    teamLabel: "Loner",
    image: "assets/cards/criceto.jpg",
    description: "You only want to survive. Immune to wolf attacks but the Seer kills you if they look at you. Win alone if you live to the end.",
    locales: {
      es: {
        name: "Hámster Licántropo",
        teamLabel: "Solitaria",
        description: "Solo quieres sobrevivir. Eres inmune a los lobos pero mueres si el Vidente te ve. Ganas en solitario si sigues vivo al final.",
      },
      it: {
        name: "Criceto Mannaro",
        teamLabel: "Solitario",
        description: "Vuoi solo sopravvivere. Sei immune ai lupi mannari ma il Veggente ti elimina se ti osserva. Vinci da solo se resti in vita fino alla fine.",
      },
    },
  },
  mythomaniac: {
    id: "mythomaniac",
    name: "Mythomaniac",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/mitomane.jpg",
    description: "At the end of the second night choose a player: if they are a Wolf you become one, if they are the Seer you inherit the power, otherwise you remain human.",
    locales: {
      es: {
        name: "Mitómano",
        teamLabel: "Aldea",
        description: "Al final de la segunda noche elige a un jugador: si es Lobo te conviertes en uno, si es Vidente heredas su poder, de lo contrario sigues como humano.",
      },
      it: {
        name: "Mitomane",
        teamLabel: "Villaggio",
        description: "Alla fine della seconda notte scegli un giocatore: se è un Lupo lo diventi, se è il Veggente erediti il suo potere, altrimenti rimani umano.",
      },
    },
  },
};

export const OPTIONAL_CONFIG = [
  { roleId: "medium", copies: 1, minPlayers: 9 },
  { roleId: "possessed", copies: 1, minPlayers: 10 },
  { roleId: "bodyguard", copies: 1, minPlayers: 11 },
  { roleId: "owl", copies: 1, minPlayers: 12 },
  { roleId: "mason", copies: 2, minPlayers: 13, noteKey: "roles.masonNote" },
  { roleId: "werehamster", copies: 1, minPlayers: 15 },
  { roleId: "mythomaniac", copies: 1, minPlayers: 16 },
];

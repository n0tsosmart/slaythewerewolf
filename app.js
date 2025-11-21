    // ========================================
    // UI/UX ENHANCEMENTS (Mobile-First)
    // ========================================

    // Smooth page load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.style.opacity = '0';
      requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
      });
    });

    // FIXED: Ripple effect only on clicked button
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, [role="button"]');

      // Only apply ripple to the actual clicked button
      if (button && !button.disabled && e.target === button || button && !button.disabled && button.contains(e.target)) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.5s ease-out;
          z-index: 0;
        `;

        button.style.position = button.style.position || 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 500);

        // Haptic feedback on mobile
        if ('vibrate' in navigator && window.matchMedia('(max-width: 768px)').matches) {
          navigator.vibrate(8);
        }
      }
    });

    // Smooth scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Toast notification system
    window.showToast = (message, duration = 2500) => {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 20px;
        background: rgba(185, 28, 28, 0.95);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 10000;
        font-family: var(--font-body);
        font-size: 14px;
        max-width: 90%;
        text-align: center;
        transition: transform 0.3s ease;
      `;

      document.body.appendChild(toast);

      // Slide in
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });

      // Slide out and remove
      setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    };

    // Form validation feedback
    document.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.style.animation = 'shake 0.3s ease';
        setTimeout(() => input.style.animation = '', 300);
      });
    });

    // Debounce utility
    window.debounce = (func, wait) => {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    // ========================================
    // END UI/UX ENHANCEMENTS
    // ========================================

    
      const MIN_PLAYERS = 5;

const ROLE_LIBRARY = {
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

const OPTIONAL_CONFIG = [
  { roleId: "medium", copies: 1, minPlayers: 9 },
  { roleId: "possessed", copies: 1, minPlayers: 10 },
  { roleId: "bodyguard", copies: 1, minPlayers: 11 },
  { roleId: "owl", copies: 1, minPlayers: 12 },
  { roleId: "mason", copies: 2, minPlayers: 13, noteKey: "roles.masonNote" },
  { roleId: "werehamster", copies: 1, minPlayers: 15 },
  { roleId: "mythomaniac", copies: 1, minPlayers: 16 },
];

const DEFAULT_LANGUAGE = "en";
const TRANSLATIONS = {
  en: {
    "header.label": "A TRIBUTE TO LUPUS IN TABULA",
    "header.title": "Slay the Werewolf",
    "header.tagline1": "Remember to slay the wolf.",
    "buttons.restart": "🔄 New game",
    "language.label": "Language",
    "setup.title": "⚙️ Setup",
    "setup.playersLabel": "Number of players",
    "setup.playersHelp": "Minimum 5 players to start",
    "setup.wolvesLabel": "Werewolves",
    "setup.namesLabel": "👥 Player names (optional)",
    "setup.namesHelp": "We keep this list even after starting a new game.",
    "setup.namesPlaceholder": "e.g. Marcus",
    "setup.wolfHint": "Suggested: {count} werewolves (~25%)",
    "buttons.addPlayer": "Add",
    "buttons.clearPlayers": "Clear list",
    "setup.specialsTitle": "✨ Special roles",
    "setup.specialsHelp": "The Seer is always included. Other roles unlock based on the player count.",
    "roles.availableFrom": "Suggested for {count}+ players.",
    "roles.masonNote": "Always add both cards together.",
    "buttons.deal": "🎴 Deal the cards",
    "reveal.title": "🔐 Secret dealing",
    "reveal.hiddenTeam": "Hidden card",
    "reveal.tap": "Tap to reveal",
    "reveal.prompt": "Make sure no one else is watching",
    "buttons.showCard": "👁️ Show card",
    "buttons.nextPlayer": "➡️ Next player",
    "handoffNotice.title": "⚠️ Pass the device to the narrator",
    "handoffNotice.body": "When every card has been seen, hand the device to the narrator before Day 1.",
    "handoffNotice.timer": "Wait {seconds}s before continuing",
    "buttons.handoff": "I am the narrator",
    "summary.title": "📋 Narrator summary",
    "buttons.hidePlayers": "Hide players",
    "buttons.showPlayers": "Show players",
    "log.title": "Eliminations",
    "log.empty": "No players eliminated yet",
    "log.entry": "{name} ({role}) was eliminated on Day {day}",
    "log.unknownRole": "unknown role",
    "fallen.title": "🪦 Fallen players",
    "fallen.empty": "No confirmed deaths yet",
    "fallen.pending": "(awaiting resolution)",
    "living.title": "👥 Living players",
    "living.empty": "No players available",
    "myth.title": "Mythomaniac",
    "myth.playerLabel": "Mythomaniac: {name}",
    "myth.targetLabel": "Choose someone to imitate",
    "myth.selectPlaceholder": "Select a player",
    "myth.noTargets": "No eligible players remain",
    "myth.waitingDescription": "Wait until the second night to let the Mythomaniac copy someone.",
    "myth.pendingDescription": "At the end of the second night pick a living player for the Mythomaniac to copy.",
    "myth.result.wolf": "{name} now hunts with the wolves after copying {target}.",
    "myth.result.seer": "{name} inherits the Seer’s power after copying {target}.",
    "myth.result.human": "{name} stays human after copying {target}.",
    "myth.status.waiting": "Waiting",
    "myth.status.ready": "Ready",
    "myth.status.done": "Resolved",
    "myth.confirm": "Apply transformation",
    "myth.blockedButton": "Resolve the Mythomaniac",
    "myth.completeWarning": "Complete the Mythomaniac transformation before advancing to the next day.",
    "day.label": "Current day",
    "buttons.nextDay": "Next day",
    "buttons.noMoreDays": "No more days",
    "guide.title": "Narration guide",
    "guide.progress": "Step {current} / {total}",
    "buttons.toggleGuide": "Show list",
    "buttons.showList": "Show list",
    "buttons.stepMode": "Step mode",
    "guide.empty": "No instructions for this day.",
    "buttons.prevStep": "⬅️ Back",
    "buttons.nextStep": "Next ➡️",
    "elimination.title": "Eliminate a player",
    "buttons.eliminate": "Eliminate",
    "buttons.revive": "Revive",
    "buttons.locked": "Locked",
    "elimination.placeholder": "Select a player",
    "elimination.none": "No living players",
    "buttons.revive": "Revive",
    "buttons.locked": "Locked",
    "buttons.newMatch": "🎮 New game",
    "final.title": "Victory",
    "buttons.finalNew": "🔁 New game",
    "modal.title": "Confirm",
    "modal.cancel": "Cancel",
    "modal.confirm": "Confirm",
    "errors.minPlayers": "⚠️ At least {count} players are required",
    "errors.needWolf": "⚠️ You need at least one werewolf",
    "errors.tooManyWolves": "⚠️ Werewolves must be fewer than the players",
    "errors.tooManySpecials": "⚠️ Too many special roles for this group",
    "status.player": "Player {current} / {total}",
    "status.defaultPlayer": "Player {number}",
    "messages.ready": "Ready to reveal",
    "messages.ensureAlone": "Make sure no one else is watching",
    "messages.completionTitle": "Ready to play",
    "messages.completionProgress": "Distribution complete",
    "messages.everyoneReady": "Everyone has seen their card",
    "messages.completionBody": "Pass the device to the narrator to start Day 1.",
    "guide.step.closeEyes": "Night {day}: everyone closes their eyes.",
    "guide.step.masons": "Call the Masons so they recognize each other.",
    "guide.step.bodyguard": "Call the Bodyguard to choose someone to protect.",
    "guide.step.seer": "Call the Seer and reveal the vision.",
    "guide.step.medium": "Call the Medium and reveal whether the previous lynch was a wolf.",
    "guide.step.owl": "Call the Owl to mark the nominated player.",
    "guide.step.mythomaniac": "Remind the Mythomaniac to pick a role to mimic.",
    "guide.step.wolves": "Call the Werewolves to choose their victim.",
    "guide.step.hamster": "Remember the Werehamster is immune to wolves and only dies to the Seer.",
    "guide.step.dawn": "Dawn {day}: announce the victims of the night.",
    "guide.step.owlReveal": "Reveal the Owl's chosen player before the discussion.",
    "guide.step.possessed": "Keep in mind there may be a Possessed ally.",
    "guide.step.dayDiscuss": "Day {day}: let the village discuss and then collect votes for the lynching.",
    "victory.village.title": "The village prevails",
    "victory.village.subtitle": "All werewolves have been slain. The village may finally rest.",
    "victory.wolves.title": "The werewolves conquer Tabula",
    "victory.wolves.subtitle": "The pack is now as strong as the villagers. There is no escape.",
    "victory.hamster.title": "The Werehamster survives",
    "victory.hamster.subtitle": "The little beast outlives everyone and wins alone.",
    "buttons.showSummary": "📜 View summary",
    "confirmation.newGame": "Start a new game?",
    "confirmation.restart": "Restart the setup?",
    "confirmation.nextDay": "Proceed to Day {day}? Make sure everyone has their eyes closed.",
    "confirmation.eliminationVictory": "Eliminating {player} will trigger {outcome}. Continue?",
    "confirmation.handoff": "Ready to open the summary? Confirm you are the narrator and everyone else is not looking.",
    "accessibility.removePlayer": "Remove {name}",
    "accessibility.movePlayerUp": "Move {name} up",
    "accessibility.movePlayerDown": "Move {name} down",
    "info.button": "📖 Immersion tips & rules",
    "info.title": "Keep the village immersive",
    "info.roleplayTitle": "Roleplay suggestions",
    "info.roleplayPlayers": "Players: stay in character, whisper suspicions, and describe gestures without meta comments such as “I was picked third”.",
    "info.roleplayNarrator": "Narrator: paint the night with sensory details, call roles by title, and pause the story if the tension breaks so everyone refocuses.",
    "info.rulesTitle": "Rules & metagame",
    "info.rulesSummary": "No screenshots, recordings, or discussions outside the table. Eliminated players remain silent unless a power explicitly reintroduces them.",
    "info.rulesMetagame": "Metagame reminders: no coded taps, no phone searches, no hints about shuffling order. The narrator may rewind a phase if immersion is broken.",
    "info.feedback": "💬 Send feedback & suggestions on GitHub",
    "footer.disclaimer": "We do not collect cookies, the artwork is AI-generated, and this free fan-made tribute keeps the Lupus In Tabula spirit alive so friends can play without physical cards.",
    "footer.license": "Released under the MIT License by n0tsosmart.",
  },
 es: {
    "header.label": "UN HOMENAJE A LUPUS IN TABULA",
    "header.title": "Slay the Werewolf",
    "header.tagline1": "Recuerda cazar al lobo.",
    "buttons.restart": "🔄 Nueva partida",
    "language.label": "Idioma",
    "setup.title": "⚙️ Preparación",
    "setup.playersLabel": "Número de jugadores",
    "setup.playersHelp": "Se necesitan al menos 5 jugadores",
    "setup.wolvesLabel": "Hombres lobo",
    "setup.namesLabel": "👥 Nombres de jugadores (opcional)",
    "setup.namesHelp": "Conservamos esta lista incluso tras comenzar otra partida.",
    "setup.namesPlaceholder": "p.ej. Marcos",
    "setup.wolfHint": "Sugerido: {count} hombres lobo (~25%)",
    "buttons.addPlayer": "Añadir",
    "buttons.clearPlayers": "Limpiar lista",
    "setup.specialsTitle": "✨ Roles especiales",
    "setup.specialsHelp": "El Vidente siempre está incluido. Los demás roles dependen del número de jugadores.",
    "roles.availableFrom": "Sugerido a partir de {count} jugadores.",
    "roles.masonNote": "Siempre se añaden las dos cartas juntas.",
    "buttons.deal": "🎴 Repartir cartas",
    "reveal.title": "🔐 Reparto secreto",
    "reveal.hiddenTeam": "Carta oculta",
    "reveal.tap": "Toca para revelar",
    "reveal.prompt": "Asegúrate de que nadie más esté mirando",
    "buttons.showCard": "👁️ Mostrar carta",
    "buttons.nextPlayer": "➡️ Siguiente jugador",
    "handoffNotice.title": "⚠️ Entrega el dispositivo al narrador",
    "handoffNotice.body": "Cuando todos hayan visto su carta, entrega el dispositivo al narrador antes del Día 1.",
    "handoffNotice.timer": "Espera {seconds}s antes de continuar",
    "buttons.handoff": "Soy el narrador",
    "summary.title": "📋 Resumen del narrador",
    "buttons.hidePlayers": "Ocultar jugadores",
    "buttons.showPlayers": "Mostrar jugadores",
    "log.title": "Eliminaciones",
    "log.empty": "Ningún jugador eliminado todavía",
    "log.entry": "{name} ({role}) fue eliminado en el Día {day}",
    "log.unknownRole": "rol desconocido",
    "fallen.title": "🪦 Jugadores caídos",
    "fallen.empty": "Aún no hay muertes confirmadas",
    "fallen.pending": "(pendiente de resolución)",
    "living.title": "👥 Jugadores vivos",
    "living.empty": "Sin jugadores disponibles",
    "myth.title": "Mitómano",
    "myth.playerLabel": "Mitómano: {name}",
    "myth.targetLabel": "Elige a quién imitar",
    "myth.selectPlaceholder": "Selecciona un jugador",
    "myth.noTargets": "No quedan objetivos disponibles",
    "myth.waitingDescription": "Espera hasta la segunda noche para que el Mitómano copie a alguien.",
    "myth.pendingDescription": "Al final de la segunda noche elige a un jugador vivo para que el Mitómano lo imite.",
    "myth.result.wolf": "{name} ahora caza con los lobos tras copiar a {target}.",
    "myth.result.seer": "{name} hereda el poder del Vidente tras copiar a {target}.",
    "myth.result.human": "{name} sigue siendo humano tras copiar a {target}.",
    "myth.status.waiting": "En espera",
    "myth.status.ready": "Listo",
    "myth.status.done": "Resuelto",
    "myth.confirm": "Aplicar transformación",
    "myth.blockedButton": "Resuelve al Mitómano",
    "myth.completeWarning": "Completa la transformación del Mitómano antes de pasar al siguiente día.",
    "day.label": "Día actual",
    "buttons.nextDay": "Siguiente día",
    "buttons.noMoreDays": "Sin más días",
    "guide.title": "Guía de narración",
    "guide.progress": "Paso {current} / {total}",
    "buttons.toggleGuide": "Mostrar lista",
    "buttons.showList": "Mostrar lista",
    "buttons.stepMode": "Modo por pasos",
    "guide.empty": "No hay instrucciones para este día.",
    "buttons.prevStep": "⬅️ Atrás",
    "buttons.nextStep": "Siguiente ➡️",
    "elimination.title": "Elimina a un jugador",
    "buttons.eliminate": "Eliminar",
    "buttons.revive": "Devolver",
    "buttons.locked": "Bloqueado",
    "elimination.placeholder": "Selecciona un jugador",
    "elimination.none": "No quedan jugadores vivos",
    "buttons.revive": "Devolver",
    "buttons.locked": "Bloqueado",
    "buttons.newMatch": "🎮 Nueva partida",
    "final.title": "Victoria",
    "buttons.finalNew": "🔁 Nueva partida",
    "modal.title": "Confirmar",
    "modal.cancel": "Cancelar",
    "modal.confirm": "Confirmar",
    "errors.minPlayers": "⚠️ Se requieren al menos {count} jugadores",
    "errors.needWolf": "⚠️ Necesitas al menos un hombre lobo",
    "errors.tooManyWolves": "⚠️ Los lobos deben ser menos que los jugadores",
    "errors.tooManySpecials": "⚠️ Demasiados roles especiales para este grupo",
    "status.player": "Jugador {current} / {total}",
    "status.defaultPlayer": "Jugador {number}",
    "messages.ready": "Listo para revelar",
    "messages.ensureAlone": "Asegúrate de que nadie más mire",
    "messages.completionTitle": "Listo para jugar",
    "messages.completionProgress": "Distribución completada",
    "messages.everyoneReady": "Todos han visto su carta",
    "messages.completionBody": "Entrega el dispositivo al narrador para comenzar el Día 1.",
    "guide.step.closeEyes": "Noche {day}: todos cierran los ojos.",
    "guide.step.masons": "Llama a los Masones para que se reconozcan.",
    "guide.step.bodyguard": "Llama al Guardián para que elija a quién proteger.",
    "guide.step.seer": "Llama al Vidente y revela su visión.",
    "guide.step.medium": "Llama al Médium y di si el linchado anterior era un lobo.",
    "guide.step.owl": "Llama al Búho para marcar al nominado.",
    "guide.step.mythomaniac": "Recuerda al Mitómano que elija a quién imitar.",
    "guide.step.wolves": "Llama a los Hombres Lobo para elegir a su víctima.",
    "guide.step.hamster": "Recuerda que el Hámster Licántropo es inmune a los lobos y solo muere con el Vidente.",
    "guide.step.dawn": "Amanecer {day}: anuncia las víctimas de la noche.",
    "guide.step.owlReveal": "Revela el nombre marcado por el Búho antes de la discusión.",
    "guide.step.possessed": "Recuerda que puede haber un Endemoniado aliado.",
    "guide.step.dayDiscuss": "Día {day}: deja que el pueblo discuta y recoge los votos del linchamiento.",
    "victory.village.title": "El pueblo resiste",
    "victory.village.subtitle": "Todos los licántropos han sido eliminados. El pueblo puede descansar.",
    "victory.wolves.title": "Los Hombres Lobo conquistan Tabula",
    "victory.wolves.subtitle": "La manada ya es tan grande como los aldeanos. No hay escapatoria.",
    "victory.hamster.title": "Triunfa el Hámster Licántropo",
    "victory.hamster.subtitle": "La pequeña bestia sobrevive a todos y gana en solitario.",
    "buttons.showSummary": "📜 Ver resumen",
    "confirmation.newGame": "¿Iniciar una nueva partida?",
    "confirmation.restart": "¿Reiniciar la configuración?",
    "confirmation.nextDay": "¿Pasar al Día {day}? Asegúrate de que todos tengan los ojos cerrados.",
    "confirmation.eliminationVictory": "Eliminar a {player} provocará {outcome}. ¿Continuar?",
    "confirmation.handoff": "¿Listo para abrir el resumen? Confirma que eres el narrador y que nadie más está mirando.",
    "accessibility.removePlayer": "Eliminar a {name}",
    "accessibility.movePlayerUp": "Subir a {name}",
    "accessibility.movePlayerDown": "Bajar a {name}",
    "info.button": "📖 Consejos de inmersión y reglas",
    "info.title": "Mantén viva la maldición del pueblo",
    "info.roleplayTitle": "Sugerencias de interpretación",
    "info.roleplayPlayers": "Jugadores: hablad como vuestros personajes, susurrad sospechas y describid gestos sin recurrir a comentarios meta como “fui el tercero en ser elegido”.",
    "info.roleplayNarrator": "Narrador: describe sonidos, olores y sombras antes de cada fase. Llama a los roles por su título y pausa la historia si el grupo rompe la tensión.",
    "info.rulesTitle": "Reglas y metajuego",
    "info.rulesSummary": "Nada de grabaciones, fotos ni charlas fuera de la mesa. Los eliminados permanecen en silencio salvo que un poder los devuelva.",
    "info.rulesMetagame": "Recordatorios de metajuego: nada de golpecitos codificados, búsquedas en el móvil ni referencias al orden del mazo. El narrador puede repetir una fase si la inmersión se rompe.",
    "info.feedback": "💬 Envía feedback y sugerencias en GitHub",
    "footer.disclaimer": "No recopilamos cookies, el arte es generado por IA y este homenaje gratuito mantiene vivo el espíritu de Lupus In Tabula para que los amigos jueguen sin cartas físicas.",
    "footer.license": "Publicado bajo la licencia MIT por n0tsosmart.",
  },
 it: {
    "header.label": "UN TRIBUTO A LUPUS IN TABULA",
    "header.title": "Slay the Werewolf",
    "header.tagline1": "Ricordati di uccidere il lupo.",
    "buttons.restart": "🔄 Nuova partita",
    "language.label": "Lingua",
    "setup.title": "⚙️ Preparazione",
    "setup.playersLabel": "Numero di giocatori",
    "setup.playersHelp": "Servono almeno 5 giocatori",
    "setup.wolvesLabel": "Lupi mannari",
    "setup.namesLabel": "👥 Nomi dei giocatori (opzionale)",
    "setup.namesHelp": "Manteniamo questo elenco anche iniziando una nuova partita.",
    "setup.namesPlaceholder": "es. Marco",
    "setup.wolfHint": "Consigliati: {count} lupi (~25%)",
    "buttons.addPlayer": "Aggiungi",
    "buttons.clearPlayers": "Svuota elenco",
    "setup.specialsTitle": "✨ Ruoli speciali",
    "setup.specialsHelp": "Il Veggente è sempre incluso!",
    "roles.availableFrom": "Consigliato da {count}+ giocatori.",
    "roles.masonNote": "Aggiungi sempre entrambe le carte.",
    "buttons.deal": "🎴 Distribuisci le carte",
    "reveal.title": "🔐 Distribuzione segreta",
    "reveal.hiddenTeam": "Carta coperta",
    "reveal.tap": "Tocca per rivelare",
    "reveal.prompt": "Assicurati che nessun altro stia guardando",
    "buttons.showCard": "👁️ Mostra carta",
    "buttons.nextPlayer": "➡️ Giocatore successivo",
    "handoffNotice.title": "⚠️ Passa il dispositivo al narratore",
    "handoffNotice.body": "Quando tutti hanno visto la carta, consegna il dispositivo al narratore prima del Giorno 1.",
    "handoffNotice.timer": "Attendi {seconds}s prima di continuare",
    "buttons.handoff": "Sono il narratore",
    "summary.title": "📋 Riepilogo narratore",
    "buttons.hidePlayers": "Nascondi giocatori",
    "buttons.showPlayers": "Mostra giocatori",
    "log.title": "Eliminazioni",
    "log.empty": "Nessun giocatore eliminato",
    "log.entry": "{name} ({role}) è stato eliminato al Giorno {day}",
    "log.unknownRole": "ruolo sconosciuto",
    "fallen.title": "🪦 Giocatori caduti",
    "fallen.empty": "Nessuna morte confermata",
    "fallen.pending": "(in attesa di risoluzione)",
    "living.title": "👥 Giocatori vivi",
    "living.empty": "Nessun giocatore disponibile",
    "myth.title": "Mitomane",
    "myth.playerLabel": "Mitomane: {name}",
    "myth.targetLabel": "Scegli chi imitare",
    "myth.selectPlaceholder": "Seleziona un giocatore",
    "myth.noTargets": "Nessun bersaglio disponibile",
    "myth.waitingDescription": "Attendi la seconda notte prima di far agire il Mitomane.",
    "myth.pendingDescription": "Alla fine della seconda notte scegli un giocatore vivo da far copiare al Mitomane.",
    "myth.result.wolf": "{name} ora lotta con i lupi dopo aver copiato {target}.",
    "myth.result.seer": "{name} eredita il potere del Veggente dopo aver copiato {target}.",
    "myth.result.human": "{name} resta umano dopo aver copiato {target}.",
    "myth.status.waiting": "In attesa",
    "myth.status.ready": "Pronto",
    "myth.status.done": "Risolto",
    "myth.confirm": "Applica trasformazione",
    "myth.blockedButton": "Risolvi il Mitomane",
    "myth.completeWarning": "Completa la trasformazione del Mitomane prima di passare al giorno successivo.",
    "day.label": "Giorno attuale",
    "buttons.nextDay": "Giorno successivo",
    "buttons.noMoreDays": "Niente altri giorni",
    "guide.title": "Guida",
    "guide.progress": "Passo {current} / {total}",
    "buttons.toggleGuide": "Mostra elenco",
    "buttons.showList": "Mostra elenco",
    "buttons.stepMode": "Modalità passi",
    "guide.empty": "Nessuna istruzione per questo giorno.",
    "buttons.prevStep": "⬅️ Indietro",
    "buttons.nextStep": "Avanti ➡️",
    "elimination.title": "Elimina un giocatore",
    "buttons.eliminate": "Elimina",
    "buttons.revive": "Rianima",
    "buttons.locked": "Bloccato",
    "elimination.placeholder": "Seleziona un giocatore",
    "elimination.none": "Nessun giocatore vivo",
    "buttons.newMatch": "🎮 Nuova partita",
    "final.title": "Vittoria",
    "buttons.finalNew": "🔁 Nuova partita",
    "modal.title": "Conferma",
    "modal.cancel": "Annulla",
    "modal.confirm": "Conferma",
    "errors.minPlayers": "⚠️ Servono almeno {count} giocatori",
    "errors.needWolf": "⚠️ Serve almeno un lupo mannaro",
    "errors.tooManyWolves": "⚠️ I lupi devono essere meno dei giocatori",
    "errors.tooManySpecials": "⚠️ Troppi ruoli speciali per questo gruppo",
    "status.player": "Giocatore {current} / {total}",
    "status.defaultPlayer": "Giocatore {number}",
    "messages.ready": "Pronti a rivelare",
    "messages.ensureAlone": "Assicurati che nessuno stia guardando",
    "messages.completionTitle": "Pronti a giocare",
    "messages.completionProgress": "Distribuzione completata",
    "messages.everyoneReady": "Tutti hanno visto la carta",
    "messages.completionBody": "Passa il dispositivo al narratore per iniziare il Giorno 1.",
    "guide.step.closeEyes": "Notte {day}: tutti chiudono gli occhi.",
    "guide.step.masons": "Chiama i Massoni perché si riconoscano.",
    "guide.step.bodyguard": "Chiama la Guardia del Corpo per decidere chi proteggere.",
    "guide.step.seer": "Chiama il Veggente e rivela la visione.",
    "guide.step.medium": "Chiama il Medium e svela se il linciato precedente era un lupo.",
    "guide.step.owl": "Chiama il Gufo per segnare il sospetto.",
    "guide.step.mythomaniac": "Ricorda al Mitomane di scegliere un ruolo da imitare.",
    "guide.step.wolves": "Chiama i Lupi Mannari per scegliere la vittima.",
    "guide.step.hamster": "Ricorda che il Criceto Mannaro è immune ai lupi e muore solo col Veggente.",
    "guide.step.dawn": "Alba {day}: annuncia le vittime della notte.",
    "guide.step.owlReveal": "Rivela il nome segnato dal Gufo prima della discussione.",
    "guide.step.possessed": "Ricorda che potrebbe esserci un Indemoniato alleato.",
    "guide.step.dayDiscuss": "Giorno {day}: lascia discutere il villaggio e raccogli i voti del linciaggio.",
    "victory.village.title": "Il villaggio trionfa",
    "victory.village.subtitle": "Tutti i lupi sono stati eliminati. Il villaggio può riposare.",
    "victory.wolves.title": "I lupi mannari conquistano Tabula",
    "victory.wolves.subtitle": "Il branco è ormai forte quanto i villici. Non c'è scampo.",
    "victory.hamster.title": "Il Criceto Mannaro sopravvive",
    "victory.hamster.subtitle": "La piccola bestia sopravvive a tutti e vince da sola.",
    "buttons.showSummary": "📜 Mostra riepilogo",
    "confirmation.newGame": "Iniziare una nuova partita?",
    "confirmation.restart": "Riavviare la configurazione?",
    "confirmation.nextDay": "Passare al Giorno {day}? Assicurati che tutti abbiano gli occhi chiusi.",
    "confirmation.eliminationVictory": "Eliminare {player} farà scattare {outcome}. Vuoi procedere?",
    "confirmation.handoff": "Pronto a mostrare il riepilogo? Conferma di essere il narratore e che nessun altro stia guardando.",
    "accessibility.removePlayer": "Rimuovi {name}",
    "accessibility.movePlayerUp": "Sposta {name} in alto",
    "accessibility.movePlayerDown": "Sposta {name} in basso",
    "info.button": "📖 Suggerimenti di immersione e regole",
    "info.title": "Mantieni vivo il mistero del villaggio",
    "info.roleplayTitle": "Suggerimenti di interpretazione",
    "info.roleplayPlayers": "Giocatori: parlate come i vostri personaggi, sussurrate i sospetti e descrivete gesti senza accennare a dettagli meta come “ero stato pescato per terzo”.",
    "info.roleplayNarrator": "Narratore: descrivi suoni, odori e luci prima di ogni fase e chiama i ruoli per titolo. Se la tensione svanisce, fermati e riportate tutti nell'atmosfera.",
    "info.rulesTitle": "Regole e metagioco",
    "info.rulesSummary": "Niente foto, registrazioni o discussioni fuori tavolo. Chi viene eliminato resta in silenzio finché un potere non lo richiama.",
    "info.rulesMetagame": "Promemoria metagame: niente colpetti in codice, ricerche al telefono o riferimenti all'ordine delle carte. Il narratore può ripetere una fase se l'immersione si rompe.",
    "info.feedback": "💬 Invia feedback e suggerimenti su GitHub",
    "footer.disclaimer": "Non raccogliamo cookie, le illustrazioni sono generate da IA e questo tributo gratuito mantiene vivo lo spirito di Lupus In Tabula per giocare tra amici senza carte fisiche.",
    "footer.license": "Distribuito con licenza MIT da n0tsosmart.",
  },
};

function formatString(template, vars = {}) {
  return template.replace(/\{(.*?)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`));
}

function t(key, vars) {
  const langPack = TRANSLATIONS[state.language] || TRANSLATIONS[DEFAULT_LANGUAGE];
  const fallback = TRANSLATIONS[DEFAULT_LANGUAGE][key];
  const template = langPack[key] ?? fallback ?? key;
  return vars ? formatString(template, vars) : template;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key) element.placeholder = t(key);
  });
}

function setLanguage(lang, { skipPersist = false, skipRender = false } = {}) {
  state.language = TRANSLATIONS[lang] ? lang : DEFAULT_LANGUAGE;
  if (el.languageSelect) el.languageSelect.value = state.language;
  updateLanguageButtons();
  if (typeof document !== "undefined") {
    document.documentElement.lang = state.language;
  }
  const selectedRoles = getSelectedSpecials().map((item) => item.roleId);
  renderRoleOptions();
  if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
  if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
  selectedRoles.forEach((roleId) => {
    const input = el.roleOptions.querySelector(`.role-option[value="${roleId}"]`);
    if (input) input.checked = true;
  });
  enforceRoleLimits();
  applyTranslations();
  renderPlayerList();
  updateHandoffTimer();
  if (!skipRender) {
    updateWolfHint();
    renderSummaryList();
    if (state.view === "summary") {
      updateNarratorUI({ preserveGuideStep: true });
    }
    if (state.view === "reveal") {
      if (el.hideBtn && !el.hideBtn.classList.contains("hidden")) {
        revealCard();
      } else {
        prepareReveal();
      }
    }
    if (state.view === "final" && state.victory) renderVictoryFromState();
  }
  if (!skipPersist) persistState();
}

function getRoleContent(roleId) {
  const base = ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager;
  const locale = base.locales?.[state.language] || {};
  return {
    name: locale.name || base.name,
    teamLabel: locale.teamLabel || base.teamLabel,
    description: locale.description || base.description,
  };
}

      const STORAGE_KEY = "SLAY_STATE";

const state = {
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
  rolesDetailsOpen: true,
  guideExpanded: true,
  language: DEFAULT_LANGUAGE,
  view: "setup",
  mythStatus: null,
  handoffCountdown: 0,
};

let suppressLivingToggle = false;
let handoffTimerId = null;

  const el = {
        setupView: document.getElementById("setupView"),
        revealView: document.getElementById("revealView"),
        summaryView: document.getElementById("summaryView"),
        rolesPanel: document.getElementById("rolesPanel"),
        rolesDetails: document.getElementById("rolesDetails"),
        setupForm: document.getElementById("setupForm"),
        playerCount: document.getElementById("playerCount"),
        wolfCount: document.getElementById("wolfCount"),
        wolfHint: document.getElementById("wolfHint"),
        playerNameInput: document.getElementById("playerNameInput"),
        addPlayerBtn: document.getElementById("addPlayerBtn"),
        playerList: document.getElementById("playerList"),
        clearPlayersBtn: document.getElementById("clearPlayersBtn"),
        validationMessage: document.getElementById("validationMessage"),
        roleOptions: document.getElementById("roleOptions"),
        revealBtn: document.getElementById("revealBtn"),
        hideBtn: document.getElementById("hideBtn"),
        roleCard: document.getElementById("roleCard"),
        roleImage: document.getElementById("roleImage"),
        handoffNotice: document.getElementById("handoffNotice"),
        handoffTimer: document.getElementById("handoffTimer"),
        revealStatus: document.getElementById("revealStatus"),
        roleTeam: document.getElementById("roleTeam"),
        roleName: document.getElementById("roleName"),
        roleDescription: document.getElementById("roleDescription"),
        playerProgress: document.getElementById("playerProgress"),
        currentPlayerLabel: document.getElementById("currentPlayerLabel"),
        summaryList: document.getElementById("summaryList"),
        livingDetails: document.getElementById("livingDetails"),
        livingCount: document.getElementById("livingCount"),
        fallenDetails: document.getElementById("fallenDetails"),
        fallenList: document.getElementById("fallenList"),
        fallenCount: document.getElementById("fallenCount"),
        mythPanel: document.getElementById("mythPanel"),
        mythStatusTag: document.getElementById("mythStatusTag"),
        mythPlayerLabel: document.getElementById("mythPlayerLabel"),
        mythInstructions: document.getElementById("mythInstructions"),
        mythTargetSelect: document.getElementById("mythTargetSelect"),
        mythConfirmBtn: document.getElementById("mythConfirmBtn"),
        mythResultMessage: document.getElementById("mythResultMessage"),
        mythSummary: document.getElementById("mythSummary"),
        mythSummaryText: document.getElementById("mythSummaryText"),
        infoFooter: document.getElementById("infoFooter"),
        restartBtn: document.getElementById("restartBtn"),
        openSummaryBtn: document.getElementById("openSummaryBtn"),
        dayCounter: document.getElementById("dayCounter"),
        nextDayBtn: document.getElementById("nextDayBtn"),
        guideProgress: document.getElementById("guideProgress"),
        guideStepText: document.getElementById("guideStepText"),
        guideFullList: document.getElementById("guideFullList"),
        guideNav: document.getElementById("guideNav"),
        toggleGuideMode: document.getElementById("toggleGuideMode"),
        prevGuideStep: document.getElementById("prevGuideStep"),
        nextGuideStep: document.getElementById("nextGuideStep"),
        eliminationSelect: document.getElementById("eliminationSelect"),
        eliminateBtn: document.getElementById("eliminateBtn"),
        finalView: document.getElementById("finalView"),
        victoryTitle: document.getElementById("victoryTitle"),
        victorySubtitle: document.getElementById("victorySubtitle"),
        victoryList: document.getElementById("victoryList"),
        finalNewGameBtn: document.getElementById("finalNewGameBtn"),
        modalOverlay: document.getElementById("modalOverlay"),
        modalTitle: document.getElementById("modalTitle"),
        modalMessage: document.getElementById("modalMessage"),
        modalCancel: document.getElementById("modalCancel"),
        modalConfirm: document.getElementById("modalConfirm"),
        languageSelect: document.getElementById("languageSelect"),
        languageToggle: document.getElementById("languageToggle"),
        languageFlag: document.getElementById("languageFlag"),
        languageMenu: document.getElementById("languageMenu"),
        languageButtons: document.querySelectorAll("[data-lang-button]"),
        languagePicker: document.querySelector(".language-picker"),
        infoButton: document.getElementById("infoButton"),
        infoOverlay: document.getElementById("infoOverlay"),
        infoClose: document.getElementById("infoClose"),
  };

init();

function persistState() {
  if (typeof localStorage === "undefined") return;
  try {
    const payload = {
      view: state.view,
      players: state.players,
      customNames: state.customNames,
      revealIndex: state.revealIndex,
      narratorDay: state.narratorDay,
      maxDays: state.maxDays,
      eliminatedPlayers: state.eliminatedPlayers,
      activeSpecialIds: state.activeSpecialIds,
      victory: state.victory,
      revealComplete: state.revealComplete,
      deckRoleIds: state.deck.map((card) => card.roleId),
      assignments: state.players.map((name, index) => ({
        name,
        roleId: state.deck[index]?.roleId || null,
      })),
      guideStepIndex: state.guideStepIndex,
      playersCollapsed: state.playersCollapsed,
      rolesDetailsOpen: state.rolesDetailsOpen,
      guideExpanded: state.guideExpanded,
      mythStatus: state.mythStatus,
      playerCount: el.playerCount.value,
      wolfCount: el.wolfCount.value,
      selectedSpecialIds: Array.from(el.roleOptions.querySelectorAll(".role-option:checked")).map(
        (input) => input.value,
      ),
      language: state.language,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Unable to save the game state", error);
  }
}

function restoreFromStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.playerCount) el.playerCount.value = data.playerCount;
    if (data.wolfCount) el.wolfCount.value = data.wolfCount;
    if (Array.isArray(data.selectedSpecialIds)) {
      el.roleOptions.querySelectorAll(".role-option").forEach((input) => {
        input.checked = data.selectedSpecialIds.includes(input.value);
      });
    }
    state.customNames = Array.isArray(data.customNames) ? [...data.customNames] : [];
    renderPlayerList();
    clampWolfCount();
    enforceRoleLimits();
    updateDeckPreview();
    const assignments = Array.isArray(data.assignments) ? data.assignments : null;
    if (assignments && assignments.length) {
      const fallbackPlayers = Array.isArray(data.players) ? data.players : [];
      state.players = assignments.map((entry, index) => entry?.name ?? fallbackPlayers[index] ?? "");
      state.deck = assignments.map((entry) => {
        if (entry && entry.roleId) {
          return createCard(ROLE_LIBRARY[entry.roleId] || ROLE_LIBRARY.villager);
        }
        return createCard(ROLE_LIBRARY.villager);
      });
    } else {
      state.players = Array.isArray(data.players) ? data.players : [];
      state.deck = deckFromRoleIds(data.deckRoleIds);
    }
    state.revealIndex = Math.min(data.revealIndex || 0, Math.max(state.players.length - 1, 0));
    state.revealComplete = Boolean(data.revealComplete);
    state.narratorDay = data.narratorDay || 1;
    state.eliminatedPlayers = Array.isArray(data.eliminatedPlayers) ? data.eliminatedPlayers : [];
    state.activeSpecialIds = Array.isArray(data.activeSpecialIds) ? data.activeSpecialIds : [];
    if (state.activeSpecialIds.includes("bodyguard")) state.maxDays = null;
    else if (data.maxDays === null) state.maxDays = null;
    else if (typeof data.maxDays === "number" && Number.isFinite(data.maxDays)) state.maxDays = data.maxDays;
    else state.maxDays = Math.max(1, state.players.length || 1);
    state.mythStatus = normalizeMythStatus(data.mythStatus);
    state.victory = data.victory || null;
    state.guideStepIndex = data.guideStepIndex || 0;
    state.playersCollapsed = Boolean(data.playersCollapsed);
    state.rolesDetailsOpen = data.rolesDetailsOpen !== undefined ? Boolean(data.rolesDetailsOpen) : true;
    state.guideExpanded = data.guideExpanded !== undefined ? Boolean(data.guideExpanded) : true;
    state.view = data.view || "setup";
    if (state.view === "handoff") {
      state.view = "reveal";
      state.revealComplete = true;
    }
    state.language = data.language || DEFAULT_LANGUAGE;

    if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
    setLanguage(state.language, { skipPersist: true, skipRender: true });
    if (state.view === "reveal" && state.deck.length) {
      if (state.revealComplete) {
        showCompletionState();
      } else {
        prepareReveal();
      }
    } else if (state.view === "summary") {
      renderSummaryList();
      updateNarratorUI({ preserveGuideStep: true });
    } else if (state.view === "final" && state.victory) {
      renderVictoryFromState();
    }
    updateEliminationSelect();
  } catch (error) {
    console.warn("Unable to restore the game state", error);
  }
}

function init() {
  renderRoleOptions();
  attachEvents();
  updateWolfHint();
  clampWolfCount();
  enforceRoleLimits();
  updateDeckPreview();
  renderPlayerList();
  restoreFromStorage();
  setLanguage(state.language, { skipPersist: true });
  showView(state.view || "setup");
}

      function attachEvents() {
        el.playerCount.addEventListener("input", () => {
          autoAdjustWolvesFromPlayers();
          updateWolfHint();
          clampWolfCount();
          enforceRoleLimits();
          updateDeckPreview();
          persistState();
        });

        el.wolfCount.addEventListener("input", () => {
          clampWolfCount();
          updateDeckPreview();
          persistState();
        });

        el.roleOptions.addEventListener("change", () => {
          updateDeckPreview();
          persistState();
        });

        el.addPlayerBtn.addEventListener("click", handleAddPlayer);
        el.playerNameInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAddPlayer();
          }
        });

        el.playerList.addEventListener("click", (event) => {
          if (!(event.target instanceof Element)) return;
          const button = event.target.closest("button");
          if (!button) return;
          if (button.classList.contains("chip-remove")) {
            const index = Number(button.dataset.index);
            state.customNames.splice(index, 1);
            renderPlayerList();
            persistState();
            return;
          }
          if (button.classList.contains("chip-move")) {
            const index = Number(button.dataset.index);
            const direction = button.dataset.direction === "up" ? -1 : 1;
            movePlayer(index, direction);
          }
        });

        el.clearPlayersBtn.addEventListener("click", () => {
          state.customNames = [];
          renderPlayerList();
          persistState();
        });

        el.setupForm.addEventListener("submit", (event) => {
          event.preventDefault();
          startGame();
        });

        if (el.roleCard) {
          el.roleCard.addEventListener("click", () => {
            if (el.roleCard.classList.contains("can-reveal") && el.revealBtn && !el.revealBtn.classList.contains("hidden")) {
              revealCard();
            }
          });
        }
        el.revealBtn.addEventListener("click", revealCard);
        el.hideBtn.addEventListener("click", nextPlayer);
        el.openSummaryBtn.addEventListener("click", () => {
          confirmAction(t("confirmation.handoff"), () => {
            showSummary();
          });
        });
        el.restartBtn.addEventListener("click", () => confirmAction(t("confirmation.restart"), resetGame));
        el.nextDayBtn.addEventListener("click", advanceDay);
        el.prevGuideStep.addEventListener("click", () => changeGuideStep(-1));
        el.nextGuideStep.addEventListener("click", () => changeGuideStep(1));
        el.summaryList.addEventListener("click", (event) => {
          if (!(event.target instanceof Element)) return;
          const button = event.target.closest(".mini-action");
          if (!button) return;
          toggleElimination(button.dataset.player || "");
        });
        el.finalNewGameBtn.addEventListener("click", () => confirmAction(t("confirmation.newGame"), resetGame));
        if (el.livingDetails) {
          el.livingDetails.addEventListener("toggle", () => {
            if (suppressLivingToggle) return;
            state.playersCollapsed = !el.livingDetails.open;
            persistState();
          });
        }
        if (el.toggleGuideMode) el.toggleGuideMode.addEventListener("click", toggleGuideMode);
        if (el.eliminateBtn) el.eliminateBtn.addEventListener("click", eliminateFromSelect);
        if (el.mythConfirmBtn) el.mythConfirmBtn.addEventListener("click", applyMythTransformation);
        if (el.rolesDetails) {
          el.rolesDetails.addEventListener("toggle", () => {
            state.rolesDetailsOpen = el.rolesDetails.open;
            persistState();
          });
        }
        if (el.languageSelect) {
          el.languageSelect.addEventListener("change", (event) => {
            setLanguage(event.target.value);
          });
        }
        if (el.languageToggle && el.languageMenu) {
          el.languageToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleLanguageMenu(el.languageMenu.classList.contains("hidden"));
          });
          document.addEventListener("click", (event) => {
            if (!el.languageMenu || el.languageMenu.classList.contains("hidden")) return;
            if (el.languagePicker && event.target instanceof Node && el.languagePicker.contains(event.target)) return;
            toggleLanguageMenu(false);
          });
          document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") toggleLanguageMenu(false);
          });
        }
        if (el.languageButtons && el.languageButtons.length) {
          el.languageButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const lang = button.dataset.langButton;
              if (lang) setLanguage(lang);
              toggleLanguageMenu(false);
            });
          });
        }

        document.querySelectorAll(".step-btn").forEach((button) => {
          const targetId = button.dataset.target;
          const delta = Number(button.dataset.delta) || 0;
          const targetInput = document.getElementById(targetId);
          if (!targetInput) return;
          button.addEventListener("click", () => adjustNumberInput(targetInput, delta));
        });

        if (el.infoButton) el.infoButton.addEventListener("click", openInfoModal);
        if (el.infoClose) el.infoClose.addEventListener("click", closeInfoModal);
        if (el.infoOverlay) {
          el.infoOverlay.addEventListener("click", (event) => {
            if (event.target === el.infoOverlay) closeInfoModal();
          });
        }
      }

      function renderRoleOptions() {
        el.roleOptions.innerHTML = "";
        OPTIONAL_CONFIG.forEach((config) => {
          const role = ROLE_LIBRARY[config.roleId];
          const localized = getRoleContent(role.id);
          const item = document.createElement("label");
          item.className = "option-item";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = role.id;
          checkbox.dataset.copies = String(config.copies);
          checkbox.dataset.minPlayers = String(config.minPlayers);
          checkbox.className = "role-option";

          const title = document.createElement("div");
          title.className = "option-title";
          title.append(checkbox);

          const name = document.createElement("span");
          name.textContent = localized.name;
          title.append(name);

          const tag = document.createElement("span");
          tag.className = `tag ${role.team}`;
          tag.textContent = localized.teamLabel;
          title.append(tag);

          const subtitle = document.createElement("p");
          subtitle.className = "help role-subtitle";
          subtitle.textContent = t("roles.availableFrom", { count: config.minPlayers });

          const description = document.createElement("p");
          description.className = "help";
          description.textContent = localized.description;
          if (config.noteKey) {
            const note = document.createElement("span");
            note.textContent = ` ${t(config.noteKey)}`;
            description.appendChild(note);
          }

          item.append(title, subtitle, description);
          el.roleOptions.appendChild(item);
        });
        enforceRoleLimits();
      }

      function updateWolfHint() {
        const playerTotal = Number(el.playerCount.value) || 0;
        const recommended = recommendWolves(playerTotal);
        el.wolfHint.textContent = t("setup.wolfHint", { count: recommended });
      }

      function recommendWolves(playerTotal) {
        if (playerTotal <= 7) return 1;
        if (playerTotal <= 10) return 2;
        if (playerTotal <= 15) return 3;
        if (playerTotal <= 20) return 4;
        return 5;
      }

      function autoAdjustWolvesFromPlayers() {
        const playerTotal = Number(el.playerCount.value) || 0;
        if (playerTotal <= 0) return;
        const recommended = recommendWolves(playerTotal);
        const limit = Math.max(1, playerTotal - 1);
        const adjusted = Math.max(1, Math.min(recommended, limit));
        el.wolfCount.value = String(adjusted);
      }

      function adjustNumberInput(input, delta) {
        const min = Number(input.min) || Number.NEGATIVE_INFINITY;
        const max = Number(input.max) || Number.POSITIVE_INFINITY;
        let value = Number(input.value) || 0;
        value += delta;
        value = Math.min(max, Math.max(min, value));
        input.value = String(value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      function clampWolfCount() {
        const playerTotal = Number(el.playerCount.value) || 0;
        let wolves = Number(el.wolfCount.value) || 1;
        if (wolves < 1) wolves = 1;
        if (playerTotal > 0) {
          wolves = Math.min(wolves, Math.max(1, playerTotal - 1));
        }
        el.wolfCount.value = String(wolves);
      }

      function enforceRoleLimits() {
        const inputs = el.roleOptions.querySelectorAll("input[type='checkbox']");
        inputs.forEach((input) => {
          input.disabled = false;
          const optionItem = input.closest(".option-item");
          if (optionItem) optionItem.classList.remove("option-disabled");
        });
      }

      function getSelectedSpecials() {
        return Array.from(el.roleOptions.querySelectorAll("input:checked")).map((input) => ({
          roleId: input.value,
          copies: Number(input.dataset.copies || "1"),
        }));
      }

      function updateDeckPreview() {
        const playerTotal = Number(el.playerCount.value) || 0;
        const wolfTotal = Number(el.wolfCount.value) || 0;
        const specialTotal = getSelectedSpecials().reduce((sum, item) => sum + item.copies, 0);
        const selected = wolfTotal + 1 + specialTotal;
        const remaining = playerTotal - selected;
        let message = "";
        if (playerTotal < MIN_PLAYERS) message = t("errors.minPlayers", { count: MIN_PLAYERS });
        else if (wolfTotal < 1) message = t("errors.needWolf");
        else if (wolfTotal >= playerTotal) message = t("errors.tooManyWolves");
        else if (remaining < 0) message = t("errors.tooManySpecials");

        el.validationMessage.textContent = message;
        return message === "";
      }

      function handleAddPlayer() {
        const name = el.playerNameInput.value.trim();
        if (!name) return;
        state.customNames.push(name);
        el.playerNameInput.value = "";
        renderPlayerList();
        persistState();
      }

      function renderPlayerList() {
        el.playerList.innerHTML = "";
        state.customNames.forEach((name, index) => {
          const item = document.createElement("li");
          item.className = "player-chip";
          const nameSpan = document.createElement("span");
          nameSpan.className = "player-name";
          nameSpan.textContent = name;
          item.appendChild(nameSpan);

          const actions = document.createElement("div");
          actions.className = "chip-actions";

          const upButton = document.createElement("button");
          upButton.type = "button";
          upButton.className = "chip-move chip-move-up";
          upButton.dataset.index = String(index);
          upButton.dataset.direction = "up";
          upButton.setAttribute("aria-label", t("accessibility.movePlayerUp", { name }));
          upButton.textContent = "↑";
          upButton.disabled = index === 0;
          actions.appendChild(upButton);

          const downButton = document.createElement("button");
          downButton.type = "button";
          downButton.className = "chip-move chip-move-down";
          downButton.dataset.index = String(index);
          downButton.dataset.direction = "down";
          downButton.setAttribute("aria-label", t("accessibility.movePlayerDown", { name }));
          downButton.textContent = "↓";
          downButton.disabled = index === state.customNames.length - 1;
          actions.appendChild(downButton);

          const removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.className = "chip-remove";
          removeButton.dataset.index = String(index);
          removeButton.setAttribute("aria-label", t("accessibility.removePlayer", { name }));
          removeButton.textContent = "×";
          actions.appendChild(removeButton);

          item.appendChild(actions);
          el.playerList.appendChild(item);
        });

        el.clearPlayersBtn.classList.toggle("hidden", state.customNames.length === 0);
      }

      function movePlayer(index, delta) {
        const targetIndex = index + delta;
        if (targetIndex < 0 || targetIndex >= state.customNames.length) return;
        const [name] = state.customNames.splice(index, 1);
        state.customNames.splice(targetIndex, 0, name);
        renderPlayerList();
        persistState();
      }

      function buildPlayerList(playerTotal) {
        const players = [];
        for (let i = 0; i < playerTotal; i += 1) {
          players.push(state.customNames[i] || t("status.defaultPlayer", { number: i + 1 }));
        }
        return players;
      }

      function buildDeck({ playerTotal, wolfTotal, specials }) {
        const deck = [];
        for (let i = 0; i < wolfTotal; i += 1) deck.push(createCard(ROLE_LIBRARY.werewolf));
        deck.push(createCard(ROLE_LIBRARY.seer));

        specials.forEach((special) => {
          const role = ROLE_LIBRARY[special.roleId];
          if (!role) return;
          for (let count = 0; count < special.copies; count += 1) {
            deck.push(createCard(role));
          }
        });

        while (deck.length < playerTotal) deck.push(createCard(ROLE_LIBRARY.villager));
        return shuffle(deck);
      }

      function createCard(role) {
        const base = role || ROLE_LIBRARY.villager;
        return {
          roleId: base.id,
          name: base.name,
          team: base.team,
          teamLabel: base.teamLabel,
          description: base.description,
          image: base.image,
        };
      }

      function deckFromRoleIds(roleIds) {
        if (!Array.isArray(roleIds)) return [];
        return roleIds.map((roleId) => createCard(ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager));
      }

      function detectMythStatusFromDeck() {
        if (!state.players.length || !state.deck.length) return null;
        const playerIndex = state.deck.findIndex((card) => card.roleId === "mythomaniac");
        if (playerIndex === -1) return null;
        return {
          playerIndex,
          playerName: state.players[playerIndex] || "",
          targetName: null,
          outcome: null,
          completed: false,
        };
      }

      function normalizeMythStatus(savedStatus) {
        if (!state.players.length) return null;
        if (savedStatus) {
          let index = -1;
          if (savedStatus.playerName) {
            index = state.players.findIndex((name) => name === savedStatus.playerName);
          }
          if (index === -1 && typeof savedStatus.playerIndex === "number") {
            index = savedStatus.playerIndex;
          }
          if (index >= 0 && index < state.players.length) {
            return {
              playerIndex: index,
              playerName: state.players[index],
              targetName: savedStatus.targetName || null,
              outcome: savedStatus.outcome || null,
              completed: Boolean(savedStatus.completed),
            };
          }
        }
        return detectMythStatusFromDeck();
      }

      function shuffle(deck) {
        const arr = [...deck];
        for (let i = arr.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      function startGame() {
        enforceRoleLimits();
        if (!updateDeckPreview()) return;

        const playerTotal = Number(el.playerCount.value) || 0;
        const wolfTotal = Number(el.wolfCount.value) || 0;
        const specials = getSelectedSpecials();

        state.players = buildPlayerList(playerTotal);
        state.deck = buildDeck({ playerTotal, wolfTotal, specials });
        state.revealIndex = 0;
        state.activeSpecialIds = Array.from(new Set(specials.map((item) => item.roleId)));
        state.mythStatus = detectMythStatusFromDeck();
        state.eliminatedPlayers = [];
        state.narratorDay = 1;
        state.maxDays = state.activeSpecialIds.includes("bodyguard") ? null : Math.max(1, state.players.length);
        state.guideSteps = [];
        state.guideStepIndex = 0;
        state.victory = null;
        state.revealComplete = false;

        prepareReveal();
        showView("reveal");
        persistState();
      }

      function prepareReveal() {
        if (!state.deck.length) return;
        clearHandoffCountdown();
        state.revealComplete = false;
        if (el.revealStatus) el.revealStatus.classList.remove("hidden");
        if (el.roleCard) el.roleCard.classList.remove("hidden");
        el.revealBtn.classList.remove("hidden");
        el.hideBtn.classList.add("hidden");
        el.openSummaryBtn.classList.add("hidden");
        el.roleImage.classList.add("hidden");
        el.roleImage.removeAttribute("src");
        el.roleImage.alt = "";
        el.roleCard.classList.remove("with-image");
        el.handoffNotice.classList.add("hidden");

        const total = state.players.length;
        const current = state.revealIndex + 1;
        el.playerProgress.textContent = t("status.player", { current, total });
        el.currentPlayerLabel.textContent = state.players[state.revealIndex];

        el.roleCard.dataset.team = "unknown";
        el.roleCard.classList.add("can-reveal");
        el.roleTeam.textContent = t("reveal.hiddenTeam");
        el.roleName.textContent = t("reveal.tap");
        el.roleDescription.textContent = t("reveal.prompt");
      }

      function revealCard() {
        const card = state.deck[state.revealIndex];
        if (!card) return;
        el.roleCard.classList.remove("can-reveal");
        const roleText = getRoleContent(card.roleId);
        el.roleCard.dataset.team = card.team;
        el.roleTeam.textContent = roleText.teamLabel;
        el.roleName.textContent = roleText.name;
        el.roleDescription.textContent = roleText.description;
        if (card.image) {
          el.roleImage.src = card.image;
          el.roleImage.alt = roleText ? roleText.name : "Role";
          el.roleImage.classList.remove("hidden");
          el.roleCard.classList.add("with-image");
        } else {
          el.roleImage.classList.add("hidden");
        el.roleCard.classList.remove("with-image");
      }
      el.revealBtn.classList.add("hidden");
      el.hideBtn.classList.remove("hidden");
      scrollToBottom();
    }

      function nextPlayer() {
        if (state.revealIndex < state.players.length - 1) {
          state.revealIndex += 1;
          prepareReveal();
          persistState();
        } else {
          showCompletionState();
          persistState();
        }
        scrollToBottom();
      }

      function showCompletionState() {
        state.revealComplete = true;
        el.roleCard.dataset.team = "humans";
        el.roleCard.classList.remove("can-reveal");
        el.roleTeam.textContent = "";
        el.roleName.textContent = "";
        el.roleDescription.textContent = "";
        el.playerProgress.textContent = "";
        el.currentPlayerLabel.textContent = "";
        el.roleImage.classList.add("hidden");
        el.roleImage.removeAttribute("src");
        el.roleCard.classList.remove("with-image");
        if (el.roleCard) el.roleCard.classList.add("hidden");
        if (el.revealStatus) el.revealStatus.classList.add("hidden");
        el.handoffNotice.classList.remove("hidden");
        el.revealBtn.classList.add("hidden");
        el.hideBtn.classList.add("hidden");
        el.openSummaryBtn.classList.remove("hidden");
        startHandoffCountdown(5);
        scrollToBottom();
      }

      function showSummary() {
        clearHandoffCountdown();
        renderSummaryList();
        updateNarratorUI();
        showView("summary");
        persistState();
      }

      function renderSummaryList() {
        if (!el.summaryList) {
          renderFallenList();
          renderMythPanel();
          updateEliminationSelect();
          return;
        }
        if (el.livingDetails) {
          suppressLivingToggle = true;
          el.livingDetails.open = !state.playersCollapsed;
          suppressLivingToggle = false;
        }
        el.summaryList.innerHTML = "";
        const winnerEntries = state.victory ? getVictorySurvivors() : null;
        const winnersSet = winnerEntries ? new Set(winnerEntries.map((entry) => entry.name)) : null;
        let renderedCount = 0;
        state.players.forEach((player, index) => {
          if (winnersSet && !winnersSet.has(player)) return;
          const card = state.deck[index];
          const eliminationEntry = state.eliminatedPlayers.find((entry) => entry.name === player);
          if (eliminationEntry?.locked) return;
          const listItem = document.createElement("li");
          listItem.className = "summary-item";
          const eliminated = Boolean(eliminationEntry);
          if (eliminated) listItem.classList.add("eliminated");

          if (card && card.image) {
            const localized = getRoleContent(card.roleId);
            const img = document.createElement("img");
            img.className = "summary-thumb";
            img.src = card.image;
            img.alt = localized ? localized.name : "Role image";
            listItem.appendChild(img);
          }

          const info = document.createElement("div");
          info.className = "summary-info";
          const name = document.createElement("span");
          name.className = "summary-name";
          name.textContent = player;
          const role = document.createElement("span");
          role.className = "summary-role";
          const roleText = card ? getRoleContent(card.roleId) : null;
          role.textContent = roleText ? roleText.name : "-";
          info.append(name, role);

          const actionBtn = document.createElement("button");
          actionBtn.type = "button";
          actionBtn.className = "mini-action";
          actionBtn.dataset.player = player;
          if (eliminated) {
            if (eliminationEntry?.locked) {
              actionBtn.classList.add("revive");
              actionBtn.textContent = t("buttons.locked");
              actionBtn.disabled = true;
            } else {
              actionBtn.classList.add("revive");
              actionBtn.textContent = t("buttons.revive");
            }
          } else {
            actionBtn.classList.add("remove");
            actionBtn.textContent = t("buttons.eliminate");
          }

          listItem.append(info, actionBtn);
          el.summaryList.appendChild(listItem);
          renderedCount += 1;
        });
        if (renderedCount === 0) {
          const empty = document.createElement("li");
          empty.className = "help";
          empty.textContent = t("living.empty");
          el.summaryList.appendChild(empty);
        }
        if (el.summaryList) el.summaryList.classList.toggle("two-column", renderedCount >= 8);
        if (el.livingCount) el.livingCount.textContent = String(renderedCount);
        renderFallenList();
        renderMythPanel();
        updateEliminationSelect();
      }

      function updateLanguageButtons() {
        if (el.languageButtons && el.languageButtons.length) {
          el.languageButtons.forEach((button) => {
            const isActive = button.dataset.langButton === state.language;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
          });
        }
        if (el.languageFlag) el.languageFlag.textContent = getLanguageFlag(state.language);
      }

      function getLanguageFlag(lang) {
        if (lang === "es") return "🇪🇸";
        if (lang === "it") return "🇮🇹";
        return "🇬🇧";
      }

      function toggleLanguageMenu(forceState) {
        if (!el.languageMenu || !el.languageToggle) return;
        const shouldShow = typeof forceState === "boolean" ? forceState : el.languageMenu.classList.contains("hidden");
        el.languageMenu.classList.toggle("hidden", !shouldShow);
        el.languageMenu.setAttribute("aria-hidden", String(!shouldShow));
        el.languageToggle.classList.toggle("active", shouldShow);
        el.languageToggle.setAttribute("aria-expanded", String(shouldShow));
      }

      function updateEliminationSelect() {
        if (!el.eliminationSelect) return;
        const alivePlayers = getLivingPlayers();
        el.eliminationSelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = alivePlayers.length ? t("elimination.placeholder") : t("elimination.none");
        placeholder.disabled = true;
        placeholder.selected = true;
        el.eliminationSelect.appendChild(placeholder);
        alivePlayers.forEach(({ name }) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          el.eliminationSelect.appendChild(option);
        });
        const disabled = alivePlayers.length === 0;
        el.eliminationSelect.disabled = disabled;
        if (el.eliminateBtn) el.eliminateBtn.disabled = disabled;
      }

      function eliminateFromSelect() {
        if (!el.eliminationSelect) return;
        const name = el.eliminationSelect.value;
        if (!name || isEliminated(name)) return;
        promptElimination(name, {
          afterConfirm: () => {
            el.eliminationSelect.value = "";
          },
        });
      }

      function toggleElimination(player) {
        if (state.victory) return;
        if (!player) return;
        if (isEliminated(player)) {
          const entry = state.eliminatedPlayers.find((item) => item.name === player);
          if (entry?.locked) return;
          state.eliminatedPlayers = state.eliminatedPlayers.filter((item) => item.name !== player);
          renderSummaryList();
          updateNarratorUI({ preserveGuideStep: true });
          return;
        }
        promptElimination(player);
      }

      function isEliminated(name) {
        return state.eliminatedPlayers.some((entry) => entry.name === name);
      }

      function addEliminationEntry(name) {
        const playerIndex = state.players.findIndex((player) => player === name);
        const roleId = playerIndex >= 0 && state.deck[playerIndex] ? state.deck[playerIndex].roleId : null;
        state.eliminatedPlayers.push({ name, roleId, day: state.narratorDay, locked: false });
        renderSummaryList();
        updateNarratorUI({ preserveGuideStep: true });
      }

      function promptElimination(name, { afterConfirm } = {}) {
        const proceed = () => {
          addEliminationEntry(name);
          if (typeof afterConfirm === "function") afterConfirm();
        };
        const outcome = predictVictoryOnElimination(name);
        if (outcome) {
          const texts = getVictoryText(outcome.team);
          confirmAction(t("confirmation.eliminationVictory", { player: name, outcome: texts.title }), proceed);
        } else {
          proceed();
        }
      }

      function predictVictoryOnElimination(name) {
        const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
        eliminatedSet.add(name);
        return computeVictoryOutcomeFromSet(eliminatedSet);
      }

      function updateNarratorUI({ preserveGuideStep = false } = {}) {
        el.dayCounter.textContent = String(state.narratorDay);
        const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
        const maxReached = hasCap && state.narratorDay >= state.maxDays;
        const mythBlocked = mythRequiresAction();
        const disableNext = maxReached || mythBlocked || Boolean(state.victory);
        el.nextDayBtn.disabled = disableNext;
        el.nextDayBtn.textContent = mythBlocked
          ? t("myth.blockedButton")
          : maxReached
            ? t("buttons.noMoreDays")
            : t("buttons.nextDay");

        const previousIndex = state.guideStepIndex;
        state.guideSteps = buildNarrationSteps(state.narratorDay);
        if (state.guideSteps.length === 0) {
          state.guideStepIndex = 0;
        } else if (!preserveGuideStep) {
          state.guideStepIndex = 0;
        } else {
          state.guideStepIndex = Math.min(previousIndex, state.guideSteps.length - 1);
        }
        renderGuide();
        renderMythPanel();
        persistState();
        updateEliminationSelect();
        evaluateVictoryConditions();
      }

      function buildNarrationSteps(day) {
        const steps = [];
        steps.push(t("guide.step.closeEyes", { day }));
        if (hasSpecial("mason") && day === 1) steps.push(t("guide.step.masons"));
        if (hasSpecial("bodyguard") && day >= 2) steps.push(t("guide.step.bodyguard"));
        steps.push(t("guide.step.seer"));
        if (hasSpecial("medium") && day >= 2) steps.push(t("guide.step.medium"));
        if (hasSpecial("owl")) steps.push(t("guide.step.owl"));
        if (isMythActive() && day === 2) steps.push(t("guide.step.mythomaniac"));
        steps.push(t("guide.step.wolves"));
        if (hasSpecial("werehamster")) steps.push(t("guide.step.hamster"));
        steps.push(t("guide.step.dawn", { day }));
        if (hasSpecial("owl")) steps.push(t("guide.step.owlReveal"));
        if (hasSpecial("possessed")) steps.push(t("guide.step.possessed"));
        steps.push(t("guide.step.dayDiscuss", { day }));
        return steps;
      }

      function hasSpecial(roleId) {
        return state.activeSpecialIds.includes(roleId);
      }

      function isMythActive() {
        return Boolean(
          state.mythStatus &&
            !state.mythStatus.completed &&
            state.mythStatus.playerName &&
            !isEliminated(state.mythStatus.playerName),
        );
      }

      function mythRequiresAction() {
        return Boolean(
          state.mythStatus &&
            !state.mythStatus.completed &&
            state.mythStatus.playerName &&
            !isEliminated(state.mythStatus.playerName) &&
            state.narratorDay >= 2,
        );
      }

      function renderGuide() {
        const total = state.guideSteps.length;
        if (el.guideProgress) el.guideProgress.classList.toggle("hidden", state.guideExpanded);
        if (total === 0) {
        el.guideProgress.textContent = t("guide.progress", { current: 0, total: 0 });
          el.guideStepText.textContent = t("guide.empty");
          el.prevGuideStep.disabled = true;
          el.nextGuideStep.disabled = true;
          el.guideStepText.classList.remove("hidden");
          el.guideFullList.classList.add("hidden");
          el.guideNav.classList.remove("hidden");
          return;
        }
        const current = state.guideStepIndex;
        el.guideProgress.textContent = t("guide.progress", { current: current + 1, total });
        const showFull = state.guideExpanded;
        if (showFull) {
          el.guideStepText.classList.add("hidden");
          el.guideNav.classList.add("hidden");
          el.guideFullList.classList.remove("hidden");
          el.guideFullList.innerHTML = "";
          state.guideSteps.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            el.guideFullList.appendChild(li);
          });
          if (el.toggleGuideMode) el.toggleGuideMode.textContent = t("buttons.stepMode");
        } else {
          el.guideFullList.classList.add("hidden");
          el.guideStepText.classList.remove("hidden");
          el.guideNav.classList.remove("hidden");
          el.guideStepText.textContent = state.guideSteps[current];
          el.prevGuideStep.disabled = current <= 0;
          el.nextGuideStep.disabled = current >= total - 1;
          if (el.toggleGuideMode) el.toggleGuideMode.textContent = t("buttons.showList");
        }
      }

      function toggleGuideMode() {
        state.guideExpanded = !state.guideExpanded;
        renderGuide();
        persistState();
      }

      function changeGuideStep(delta) {
        if (!state.guideSteps.length) return;
        const nextIndex = state.guideStepIndex + delta;
        if (nextIndex < 0 || nextIndex >= state.guideSteps.length) return;
        state.guideStepIndex = nextIndex;
        renderGuide();
        persistState();
      }

      function renderFallenList() {
        if (!el.fallenList || !el.fallenCount) return;
        const fallen = state.eliminatedPlayers;
        el.fallenCount.textContent = String(fallen.length);
        el.fallenList.innerHTML = "";
        if (!fallen.length) {
          const li = document.createElement("li");
          li.className = "fallen-empty";
          li.textContent = t("fallen.empty");
          el.fallenList.appendChild(li);
          return;
        }
        fallen.forEach((entry) => {
          const li = document.createElement("li");
          const pending = entry.locked ? "" : ` ${t("fallen.pending")}`;
          li.textContent = `${t("log.entry", {
            name: entry.name,
            day: entry.day ?? "?",
            role: getRoleNameFromEntry(entry),
          })} ${pending}`.trim();
          el.fallenList.appendChild(li);
        });
      }

      function hideMythUI() {
        if (el.mythPanel) el.mythPanel.classList.add("hidden");
        if (el.mythSummary) el.mythSummary.classList.add("hidden");
      }

      function showMythSummary(text) {
        if (!el.mythSummary) return;
        if (!text) {
          el.mythSummary.classList.add("hidden");
          if (el.mythSummaryText) el.mythSummaryText.textContent = "";
          return;
        }
        el.mythSummary.classList.remove("hidden");
        if (el.mythSummaryText) el.mythSummaryText.textContent = text;
      }

      function renderMythPanel() {
        if (!el.mythPanel && !el.mythSummary) return;
        if (!state.mythStatus) {
          hideMythUI();
          return;
        }
        const status = state.mythStatus;
        if (!status.playerName || isEliminated(status.playerName)) {
          state.mythStatus = null;
          hideMythUI();
          return;
        }
        if (el.mythPlayerLabel) {
          el.mythPlayerLabel.textContent = t("myth.playerLabel", { name: status.playerName });
        }
        const completed = Boolean(status.completed);
        const waiting = state.narratorDay < 2;
        const livingTargets = getLivingPlayers().filter((entry) => entry.name !== status.playerName);
        const hasTargets = livingTargets.length > 0;
        const actionable = !completed && !waiting && hasTargets;
        const statusKey = completed
          ? "myth.status.done"
          : waiting
            ? "myth.status.waiting"
            : "myth.status.ready";
        if (el.mythStatusTag) el.mythStatusTag.textContent = t(statusKey);
        if (!actionable) {
          if (el.mythPanel) el.mythPanel.classList.add("hidden");
          const summaryText = completed
            ? getMythResultText(status)
            : waiting
              ? t("myth.waitingDescription")
              : hasTargets
                ? t("myth.pendingDescription")
                : t("myth.noTargets");
          showMythSummary(summaryText);
          return;
        }
        if (el.mythPanel) el.mythPanel.classList.remove("hidden");
        showMythSummary("");
        if (el.mythTargetSelect) {
          el.mythTargetSelect.innerHTML = "";
          const placeholder = document.createElement("option");
          placeholder.value = "";
          placeholder.textContent = t("myth.selectPlaceholder");
          placeholder.disabled = true;
          placeholder.selected = true;
          el.mythTargetSelect.appendChild(placeholder);
          livingTargets.forEach(({ name }) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            el.mythTargetSelect.appendChild(option);
          });
          el.mythTargetSelect.disabled = false;
          if (el.mythConfirmBtn) el.mythConfirmBtn.disabled = false;
        }
        if (el.mythInstructions) {
          el.mythInstructions.textContent = t("myth.pendingDescription");
        }
        if (el.mythResultMessage) {
          el.mythResultMessage.textContent = "";
        }
      }

      function startHandoffCountdown(seconds = 5) {
        clearHandoffCountdown();
        state.handoffCountdown = Math.max(0, seconds);
        updateHandoffTimer();
        if (state.handoffCountdown <= 0) return;
        handoffTimerId = setInterval(() => {
          state.handoffCountdown -= 1;
          if (state.handoffCountdown <= 0) {
            clearHandoffCountdown();
          } else {
            updateHandoffTimer();
          }
        }, 1000);
      }

      function clearHandoffCountdown() {
        if (handoffTimerId) {
          clearInterval(handoffTimerId);
          handoffTimerId = null;
        }
        if (state.handoffCountdown !== 0) {
          state.handoffCountdown = 0;
        }
        updateHandoffTimer();
      }

      function updateHandoffTimer() {
        if (!el.handoffTimer || !el.openSummaryBtn) return;
        if (state.handoffCountdown > 0) {
          el.handoffTimer.textContent = t("handoffNotice.timer", { seconds: state.handoffCountdown });
          el.handoffTimer.classList.remove("hidden");
          el.openSummaryBtn.disabled = true;
        } else {
          el.handoffTimer.textContent = "";
          el.handoffTimer.classList.add("hidden");
          el.openSummaryBtn.disabled = false;
        }
      }

      function getMythResultText(status) {
        if (!status || !status.playerName) return "";
        const mythName = status.playerName;
        const target = status.targetName || t("myth.noTargets");
        if (status.outcome === "wolf") return t("myth.result.wolf", { name: mythName, target });
        if (status.outcome === "seer") return t("myth.result.seer", { name: mythName, target });
        return t("myth.result.human", { name: mythName, target });
      }

      function getRoleNameFromEntry(entry) {
        if (!entry) return t("log.unknownRole");
        if (entry.roleId) {
          const localized = getRoleContent(entry.roleId);
          if (localized?.name) return localized.name;
        }
        const index = state.players.findIndex((player) => player === entry.name);
        const fallbackCard = index >= 0 ? state.deck[index] : null;
        if (fallbackCard) {
          const localized = getRoleContent(fallbackCard.roleId);
          if (localized?.name) return localized.name;
        }
        return t("log.unknownRole");
      }

      function applyMythTransformation() {
        if (!state.mythStatus || state.mythStatus.completed) return;
        if (state.narratorDay < 2) return;
        if (!el.mythTargetSelect) return;
        const targetName = el.mythTargetSelect.value;
        if (!targetName) return;
        const targetIndex = state.players.findIndex((name) => name === targetName);
        if (targetIndex === -1) return;
        const targetCard = state.deck[targetIndex];
        const outcome = determineMythOutcome(targetCard);
        if (outcome === "wolf") {
          state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.werewolf);
        } else if (outcome === "seer") {
          state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.seer);
        }
        state.mythStatus = {
          ...state.mythStatus,
          completed: true,
          targetName,
          outcome,
        };
        renderSummaryList();
        updateNarratorUI({ preserveGuideStep: true });
        persistState();
      }

      function determineMythOutcome(card) {
        if (!card) return "human";
        if (card.roleId === "seer") return "seer";
        if (card.team === "wolves") return "wolf";
        return "human";
      }

      function advanceDay() {
        if (state.victory) return;
        if (mythRequiresAction()) {
          renderMythPanel();
          if (el.mythResultMessage) el.mythResultMessage.textContent = t("myth.completeWarning");
          return;
        }
        const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
        if (hasCap && state.narratorDay >= state.maxDays) return;
        const nextDay = state.narratorDay + 1;
        confirmAction(
          t("confirmation.nextDay", { day: nextDay }),
          () => {
            state.narratorDay += 1;
            state.guideStepIndex = 0;
            state.eliminatedPlayers = state.eliminatedPlayers.map((entry) => ({
              ...entry,
              locked: true,
            }));
            renderSummaryList();
            updateNarratorUI();
          },
        );
      }

      function confirmAction(message, onConfirm) {
        el.modalTitle.textContent = t("modal.title");
        el.modalMessage.textContent = message;
        el.modalOverlay.classList.remove("hidden");
        const cleanup = () => {
          el.modalOverlay.classList.add("hidden");
          el.modalCancel.removeEventListener("click", cancelHandler);
          el.modalConfirm.removeEventListener("click", confirmHandler);
        };
        const cancelHandler = () => cleanup();
        const confirmHandler = () => {
          cleanup();
          if (typeof onConfirm === "function") onConfirm();
        };
        el.modalCancel.addEventListener("click", cancelHandler);
        el.modalConfirm.addEventListener("click", confirmHandler);
      }

      function openInfoModal() {
        if (!el.infoOverlay) return;
        el.infoOverlay.classList.remove("hidden");
      }

      function closeInfoModal() {
        if (!el.infoOverlay) return;
        el.infoOverlay.classList.add("hidden");
      }

      function scrollToBottom() {
        if (state.view !== "reveal") return;
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });
      }

      function getLivingPlayers() {
        return state.players
          .map((name, index) => ({ name, card: state.deck[index] }))
          .filter((entry) => !isEliminated(entry.name));
      }

      function computeVictoryOutcomeFromSet(eliminatedSet) {
        if (!state.deck.length || !state.players.length) return null;
        if (state.deck.length < state.players.length) return null;
        const living = state.players
          .map((name, index) => ({ name, card: state.deck[index] }))
          .filter((entry) => !eliminatedSet.has(entry.name));
        if (!living.length) return null;
        const wolves = living.filter((entry) => entry.card?.team === "wolves");
        const humans = living.filter((entry) => entry.card?.team === "humans");
        const hamsters = living.filter((entry) => entry.card?.roleId === "werehamster");

        if (hamsters.length && hamsters.length === living.length) {
          return { team: "loner", survivors: living };
        }
        if (!wolves.length) {
          if (hamsters.length) return { team: "loner", survivors: hamsters };
          return { team: "humans", survivors: living };
        }
        const unstoppableWolves = !hamsters.length && wolves.length > 0 && humans.length === wolves.length + 1 && humans.length > 1;
        if (unstoppableWolves) {
          return { team: "wolves", survivors: wolves };
        }
        if (wolves.length >= humans.length) {
          if (hamsters.length) return { team: "loner", survivors: hamsters };
          return { team: "wolves", survivors: living };
        }
        return null;
      }

      function getVictorySurvivors() {
        if (!state.victory) return getLivingPlayers();
        if (Array.isArray(state.victory.survivors)) {
          return state.victory.survivors.map((entry) => ({
            name: entry.name,
            card: entry.roleId ? createCard(ROLE_LIBRARY[entry.roleId]) : null,
          }));
        }
        return getLivingPlayers();
      }

      function evaluateVictoryConditions() {
        if (state.victory) return;
        const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
        const outcome = computeVictoryOutcomeFromSet(eliminatedSet);
        if (outcome) {
          showVictoryScreen(outcome);
        }
      }

      function showVictoryScreen({ team, survivors }) {
        state.victory = {
          team,
          survivors: survivors.map((entry) => ({
            name: entry.name,
            roleId: entry.card?.roleId || null,
          })),
        };
        const texts = getVictoryText(team);
        el.victoryTitle.textContent = texts.title;
        el.victorySubtitle.textContent = texts.subtitle;
        el.victoryList.innerHTML = "";
        survivors.forEach((entry) => {
          const li = document.createElement("li");
          li.className = "summary-item";
          const info = document.createElement("div");
          info.className = "summary-info";
          const name = document.createElement("span");
          name.className = "summary-name";
          name.textContent = entry.name;
          const role = document.createElement("span");
          role.className = "summary-role";
          const localized = entry.card ? getRoleContent(entry.card.roleId) : null;
          role.textContent = localized ? localized.name : "-";
          info.append(name, role);
          li.appendChild(info);
          el.victoryList.appendChild(li);
        });
        showView("final");
      }

      function renderVictoryFromState() {
        if (!state.victory) return;
        const winners = getVictorySurvivors();
        const texts = getVictoryText(state.victory.team);
        el.victoryTitle.textContent = texts.title;
        el.victorySubtitle.textContent = texts.subtitle;
        el.victoryList.innerHTML = "";
        winners.forEach((entry) => {
          const li = document.createElement("li");
          li.className = "summary-item";
          const info = document.createElement("div");
          info.className = "summary-info";
          const name = document.createElement("span");
          name.className = "summary-name";
          name.textContent = entry.name;
          const role = document.createElement("span");
          role.className = "summary-role";
          const localized = entry.card ? getRoleContent(entry.card.roleId) : null;
          role.textContent = localized ? localized.name : "-";
          info.append(name, role);
          li.appendChild(info);
          el.victoryList.appendChild(li);
        });
      }

      function getVictoryText(team) {
        if (team === "wolves") {
          return { title: t("victory.wolves.title"), subtitle: t("victory.wolves.subtitle") };
        }
        if (team === "loner") {
          return { title: t("victory.hamster.title"), subtitle: t("victory.hamster.subtitle") };
        }
        return { title: t("victory.village.title"), subtitle: t("victory.village.subtitle") };
      }

      function showView(view) {
        if (view !== "reveal") clearHandoffCountdown();
        [el.setupView, el.revealView, el.summaryView, el.finalView].forEach((section) => {
          section.classList.add("hidden");
        });
        if (view === "setup") el.setupView.classList.remove("hidden");
        if (view === "reveal") el.revealView.classList.remove("hidden");
        if (view === "summary") el.summaryView.classList.remove("hidden");
        if (view === "final") el.finalView.classList.remove("hidden");
        if (el.rolesPanel) {
          const hide = view !== "setup";
          el.rolesPanel.classList.toggle("hidden", hide);
          if (!hide && el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
        }
        state.view = view;
        toggleLanguageMenu(false);
        updateFooterVisibility();
        persistState();
      }


      function updateFooterVisibility() {
        if (!el.infoFooter) return;
        el.infoFooter.classList.toggle("hidden", state.view !== "setup");
      }

      function resetGame({ preserveNames = true } = {}) {
        const preservedPlayerCount = el.playerCount.value;
        const preservedWolfCount = el.wolfCount.value;
        clearHandoffCountdown();
        state.deck = [];
        state.players = [];
        state.revealIndex = 0;
        if (!preserveNames) state.customNames = [];
        state.activeSpecialIds = getSelectedSpecials().map((item) => item.roleId);
        state.eliminatedPlayers = [];
        state.narratorDay = 1;
        state.maxDays = 1;
        state.mythStatus = null;
        state.guideSteps = [];
        state.guideStepIndex = 0;
        state.victory = null;
        state.playersCollapsed = false;
        state.guideExpanded = true;
        state.revealComplete = false;
        el.playerNameInput.value = "";
        el.playerCount.value = preservedPlayerCount || el.playerCount.min || String(MIN_PLAYERS);
        el.wolfCount.value = preservedWolfCount || el.wolfCount.min || "1";
        el.openSummaryBtn.classList.add("hidden");
        renderPlayerList();
        updateWolfHint();
        clampWolfCount();
        enforceRoleLimits();
        updateDeckPreview();
        el.handoffNotice.classList.add("hidden");
        showView("setup");
      }
    

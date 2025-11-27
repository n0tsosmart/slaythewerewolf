/**
 * @fileoverview
 * This file contains all multi-language translations used throughout the Slay the Werewolf application.
 * Translations are organized by language code (e.g., 'en', 'es', 'it') and then by logical sections
 * or components of the user interface.
 *
 * Each key represents a specific text string displayed to the user, and its value is the
 * translated text for the corresponding language.
 */
window.TRANSLATIONS = {
    // --------------------------------------------------------------------------
    // English (en) Translations
    // --------------------------------------------------------------------------
    en: {
        // Header Section
        "header.label": "A TRIBUTE TO LUPUS IN TABULA",
        "header.title": "Slay the Werewolf",
        "header.tagline1": "Remember to slay the wolf.",

        // Global Buttons
        "buttons.restart": "🔄 New game",
        "buttons.addPlayer": "Add",
        "buttons.clearPlayers": "Clear list",
        "buttons.lynch": "Lynch",
        "buttons.deal": "🎴 Deal the cards",
        "buttons.showCard": "👁️ Show card",
        "buttons.nextPlayer": "➡️ Next player",
        "buttons.handoff": "I am the narrator",
        "buttons.hidePlayers": "Hide players",
        "buttons.showPlayers": "Show players",
        "buttons.revive": "Revive",
        "buttons.locked": "Locked",
        "buttons.nextDay": "Next day",
        "buttons.noMoreDays": "No more days",
        "buttons.toggleGuide": "Show list",
        "buttons.showList": "Show list",
        "buttons.stepMode": "Step mode",
        "buttons.prevStep": "⬅️ Back",
        "buttons.nextStep": "Next ➡️",
        "buttons.eliminate": "🐺 Mauled",
        "buttons.eliminateNight": "Eliminate",
        "buttons.newMatch": "🎮 New game",
        "buttons.finalNew": "🔁 New game",
        "buttons.showSummary": "📜 View summary",

        // Language Picker
        "language.label": "Language",

        // Setup Screen
        "setup.title": "⚙️ Setup",
        "setup.playersLabel": "Number of players",
        "setup.playersHelp": "Minimum 5 players to start, max 24 players",
        "setup.wolvesLabel": "Werewolves",
        "setup.namesLabel": "👥 Player names (optional)",
        "setup.namesHelp": "We keep this list even after starting a new game.",
        "setup.namesPlaceholder": "e.g. Marcus",
        "setup.wolfHint": "Automatically calculated wolves (customizable: up to 3)",
        "setup.reorderHint": "Drag and drop to reorder players",
        "setup.specialsTitle": "✨ Special roles",
        "setup.specialsHelp": "The Seer is always included. Other roles unlock based on the player count.",
        "setup.rolesSummary": "Role composition",
        "setup.rolesInDeck": "{count}× {role}",

        // Role-related messages
        "roles.availableFrom": "Suggested for {count}+ players.",
        "roles.masonNote": "Always add both cards together.",

        // Reveal Phase
        "reveal.title": "🔐 Secret dealing",
        "reveal.hiddenTeam": "Hidden card",
        "reveal.tap": "Tap to reveal",
        "reveal.prompt": "Make sure no one else is watching",

        // Handoff Notice
        "handoffNotice.title": "⚠️ Pass the device to the narrator",
        "handoffNotice.body": "When every card has been seen, hand the device to the narrator before Day 1.",
        "handoffNotice.timer": "Wait {seconds}s before continuing",

        // Narrator Summary Screen
        "summary.title": "📋 Narrator summary",
        "log.title": "Eliminations",
        "log.empty": "No players eliminated yet",
        "log.entry": "{name} ({role}) was eliminated on Day {day}",
        "log.unknownRole": "unknown role",
        "fallen.title": "🪦 Fallen players",
        "fallen.empty": "No confirmed deaths yet",
        "fallen.pending": "(awaiting resolution)",
        "living.title": "👥 Living players",
        "living.empty": "No players available",

        // Mythomaniac Role
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

        // Day Cycle
        "day.label": "Current day",

        // Narrator Guide
        "guide.title": "Narration guide",
        "guide.progress": "Step {current} / {total}",
        "guide.empty": "No instructions for this day.",
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

        // Elimination & Revive
        "elimination.title": "Eliminate a player",
        "elimination.placeholder": "Select a player",
        "elimination.none": "No living players",

        // Final View / Victory Screen
        "final.title": "Victory",
        "victory.village.title": "The village prevails",
        "victory.village.subtitle": "All werewolves have been slain. The village may finally rest.",
        "victory.wolves.title": "The werewolves conquer Tabula",
        "victory.wolves.subtitle": "The pack is now as strong as the villagers. There is no escape.",
        "victory.hamster.title": "The Werehamster survives",
        "victory.hamster.subtitle": "The little beast outlives everyone and wins alone.",

        // Modals
        "modal.title": "Confirm",
        "modal.cancel": "Cancel",
        "modal.confirm": "Confirm",

        // Error Messages
        "errors.minPlayers": "⚠️ At least {count} players are required",
        "errors.needWolf": "⚠️ You need at least one werewolf",
        "errors.tooManyWolves": "⚠️ Werewolves must be fewer than the players",
        "errors.tooManySpecials": "⚠️ Too many special roles for this group",

        // Status Messages
        "status.player": "Player {current} / {total}",
        "status.defaultPlayer": "Player {number}",
        "status.indiziato": "Suspect",
        "status.benvenuto": "Welcome!",

        // Game Messages
        "messages.ready": "Ready to reveal",
        "messages.ensureAlone": "Make sure no one else is watching",
        "messages.completionTitle": "Ready to play",
        "messages.completionProgress": "Distribution complete",
        "messages.everyoneReady": "Everyone has seen their card",
        "messages.completionBody": "Pass the device to the narrator to start Day 1.",

        // Confirmation Prompts
        "confirmation.newGame": "Start a new game?",
        "confirmation.restart": "Restart the setup?",
        "confirmation.nextDay": "Proceed to Day {day}? Make sure everyone has their eyes closed.",
        "confirmation.eliminationVictory": "Eliminating {player} will trigger {outcome}. Continue?",
        "confirmation.lynch": "Are you sure you want to lynch {player}?",
        "confirmation.handoff": "Ready to open the summary? Confirm you are the narrator and everyone else is not looking.",

        // Accessibility Labels
        "accessibility.removePlayer": "Remove {name}",
        "accessibility.movePlayerUp": "Move {name} up",
        "accessibility.movePlayerDown": "Move {name} down",

        // Info & Rules
        "info.button": "📖 Immersion tips & rules",
        "info.title": "Keep the village immersive",
        "info.roleplayTitle": "Roleplay suggestions",
        "info.roleplayPlayers": "Players: stay in character, whisper suspicions, and describe gestures without meta comments such as “I was picked third”.",
        "info.roleplayNarrator": "Narrator: paint the night with sensory details, call roles by title, and pause the story if the tension breaks so everyone refocuses.",
        "info.rulesTitle": "Rules & metagame",
        "info.rulesSummary": "No screenshots, recordings, or discussions outside the table. Eliminated players remain silent unless a power τους reintroduces them.",
        "info.rulesMetagame": "Metagame reminders: no coded taps, no phone searches, no hints about shuffling order. The narrator may rewind a phase if immersion is broken.",
        "info.feedback": "💬 Send feedback & suggestions on GitHub",

        // Footer
        "footer.disclaimer": "We do not collect cookies, the artwork is AI-generated, and this free fan-made tribute keeps the Lupus In Tabula spirit alive so friends can play without physical cards.",
        "footer.license": "Released under the MIT License by n0tsosmart.",

        // Voting UI
        "votes.label": "Votes",
        "votes.increment": "Add vote",
        "votes.decrement": "Remove vote",
        "menu.voting": "🗳️ Voting Rules",
        "voting.title": "Voting Rules",
        "voting.indiziatoTitle": "Suspects",
        "voting.indiziatoBody": "The two players with the most votes become suspects. In case of a tie, the moderator asks each player starting from the one to the left of the 'Welcome!' holder (clockwise).",
        "voting.lynchTitle": "Lynching",
        "voting.lynchBody": "Only living players (excluding suspects and ghosts) vote to lynch one of the suspects. The suspect with the most votes is eliminated.",
        "voting.tieTitle": "Tie-breaking",
        "voting.tieBody": "If there is a tie during the lynching vote, the suspect closest to the 'Welcome!' player (clockwise, starting from the left) is eliminated.",
        "voting.ghostTitle": "Ghosts",
        "voting.ghostBody": "Ghosts can vote to choose suspects but cannot vote for lynching.",
    },

    // --------------------------------------------------------------------------
    // Spanish (es) Translations
    // --------------------------------------------------------------------------
    es: {
        // Header Section
        "header.label": "UN HOMENAJE A LUPUS IN TABULA",
        "header.title": "Slay the Werewolf",
        "header.tagline1": "Recuerda cazar al lobo.",

        // Global Buttons
        "buttons.restart": "🔄 Nueva partida",
        "buttons.addPlayer": "Añadir",
        "buttons.clearPlayers": "Limpiar lista",
        "buttons.lynch": "🔥 Linchar",
        "buttons.deal": "🎴 Repartir cartas",
        "buttons.showCard": "👁️ Mostrar carta",
        "buttons.nextPlayer": "➡️ Siguiente jugador",
        "buttons.handoff": "Soy el narrador",
        "buttons.hidePlayers": "Ocultar jugadores",
        "buttons.showPlayers": "Mostrar jugadores",
        "buttons.revive": "Devolver",
        "buttons.locked": "Bloqueado",
        "buttons.nextDay": "Siguiente día",
        "buttons.noMoreDays": "Sin más días",
        "buttons.toggleGuide": "Mostrar lista",
        "buttons.showList": "Mostrar lista",
        "buttons.stepMode": "Modo por pasos",
        "buttons.prevStep": "⬅️ Atrás",
        "buttons.nextStep": "Siguiente ➡️",
        "buttons.eliminate": "🐺 Devorado",
        "buttons.eliminateNight": "Eliminado",
        "buttons.newMatch": "🎮 Nueva partida",
        "buttons.finalNew": "🔁 Nueva partida",
        "buttons.showSummary": "📜 Ver resumen",

        // Language Picker
        "language.label": "Idioma",

        // Setup Screen
        "setup.title": "⚙️ Preparación",
        "setup.playersLabel": "Número de jugadores",
        "setup.playersHelp": "Se necesitan al menos 5 jugadores, max 24 jugadores",
        "setup.wolvesLabel": "Hombres lobo",
        "setup.namesLabel": "👥 Nombres de jugadores (opcional)",
        "setup.namesHelp": "Conservamos esta lista incluso tras comenzar otra partida.",
        "setup.namesPlaceholder": "p.ej. Marcos",
        "setup.wolfHint": "Lobos calculados automáticamente (personalizables: máximo 3)",
        "setup.reorderHint": "Arrastra y suelta para reordenar jugadores",
        "setup.specialsTitle": "✨ Roles especiales",
        "setup.specialsHelp": "El Vidente siempre está incluido. Los demás roles dependen del número de jugadores.",
        "setup.rolesSummary": "Composición de roles",
        "setup.rolesInDeck": "{count}× {role}",

        // Role-related messages
        "roles.availableFrom": "Sugerido a partir de {count} jugadores.",
        "roles.masonNote": "Siempre se añaden las dos cartas juntas.",

        // Reveal Phase
        "reveal.title": "🔐 Reparto secreto",
        "reveal.hiddenTeam": "Carta oculta",
        "reveal.tap": "Toca para revelar",
        "reveal.prompt": "Asegúrate de que nadie más esté mirando",

        // Handoff Notice
        "handoffNotice.title": "⚠️ Entrega el dispositivo al narrador",
        "handoffNotice.body": "Cuando todos hayan visto su carta, entrega el dispositivo al narrador antes del Día 1.",
        "handoffNotice.timer": "Espera {seconds}s antes de continuar",

        // Narrator Summary Screen
        "summary.title": "📋 Resumen del narrador",
        "log.title": "Eliminaciones",
        "log.empty": "Ningún jugador eliminado todavía",
        "log.entry": "{name} ({role}) fue eliminado en el Día {day}",
        "log.unknownRole": "rol desconocido",
        "fallen.title": "🪦 Jugadores caídos",
        "fallen.empty": "Aún no hay muertes confirmadas",
        "fallen.pending": "(pendiente de resolución)",
        "living.title": "👥 Jugadores vivos",
        "living.empty": "Sin jugadores disponibles",

        // Mythomaniac Role
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

        // Day Cycle
        "day.label": "Día actual",

        // Narrator Guide
        "guide.title": "Guía de narración",
        "guide.progress": "Paso {current} / {total}",
        "guide.empty": "No hay instrucciones para este día.",
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

        // Elimination & Revive
        "elimination.title": "Elimina a un jugador",
        "elimination.placeholder": "Selecciona un jugador",
        "elimination.none": "No quedan jugadores vivos",

        // Final View / Victory Screen
        "final.title": "Victoria",
        "victory.village.title": "El pueblo resiste",
        "victory.village.subtitle": "Todos los licántropos han sido eliminados. El pueblo puede descansar.",
        "victory.wolves.title": "Los Hombres Lobo conquistan Tabula",
        "victory.wolves.subtitle": "La manada ya es tan grande como los aldeanos. No hay escapatoria.",
        "victory.hamster.title": "Triunfa el Hámster Licántropo",
        "victory.hamster.subtitle": "La pequeña bestia sobrevive a todos y gana en solitario.",

        // Modals
        "modal.title": "Confirmar",
        "modal.cancel": "Cancelar",
        "modal.confirm": "Confirmar",

        // Error Messages
        "errors.minPlayers": "⚠️ Se requieren al menos {count} jugadores",
        "errors.needWolf": "⚠️ Necesitas al menos un hombre lobo",
        "errors.tooManyWolves": "⚠️ Los lobos deben ser menos que los jugadores",
        "errors.tooManySpecials": "⚠️ Demasiados roles especiales para este grupo",

        // Status Messages
        "status.player": "Jugador {current} / {total}",
        "status.defaultPlayer": "Jugador {number}",
        "status.indiziato": "Sospechoso",
        "status.benvenuto": "¡Bienvenido!",

        // Game Messages
        "messages.ready": "Listo para revelar",
        "messages.ensureAlone": "Asegúrate de que nadie más mire",
        "messages.completionTitle": "Listo para jugar",
        "messages.completionProgress": "Distribución completada",
        "messages.everyoneReady": "Todos han visto su carta",
        "messages.completionBody": "Entrega el dispositivo al narrador para comenzar el Día 1.",

        // Confirmation Prompts
        "confirmation.newGame": "¿Iniciar una nueva partida?",
        "confirmation.restart": "¿Reiniciar la configuración?",
        "confirmation.nextDay": "¿Pasar al Día {day}? Asegúrate de que todos tengan los ojos cerrados.",
        "confirmation.eliminationVictory": "Eliminar a {player} provocará {outcome}. ¿Continuar?",
        "confirmation.lynch": "¿Estás seguro de que quieres linchar a {player}?",
        "confirmation.handoff": "¿Listo para abrir el resumen? Confirma que eres el narrador y que nadie más está mirando.",

        // Accessibility Labels
        "accessibility.removePlayer": "Eliminar a {name}",
        "accessibility.movePlayerUp": "Subir a {name}",
        "accessibility.movePlayerDown": "Bajar a {name}",

        // Info & Rules
        "info.button": "📖 Consejos de inmersión y reglas",
        "info.title": "Mantén viva la maldición del pueblo",
        "info.roleplayTitle": "Sugerencias de interpretación",
        "info.roleplayPlayers": "Jugadores: hablad como vuestros personajes, susurrad sospechas y describid gestos sin recurrir a comentarios meta como “fui el tercero en ser elegido”.",
        "info.roleplayNarrator": "Narrador: describe sonidos, olores y sombras antes de cada fase. Llama a los roles por su título y pausa la historia si el grupo rompe la tensión.",
        "info.rulesTitle": "Reglas y metajuego",
        "info.rulesSummary": "Nada de grabaciones, fotos ni charlas fuera de la mesa. Los eliminados permanecen en silencio salvo que un poder los devuelva.",
        "info.rulesMetagame": "Recordatorios de metajuego: nada de golpecitos codificados, búsquedas en el móvil ni referencias al orden del mazo. El narrador puede repetir una fase si la inmersión se rompe.",
        "info.feedback": "💬 Envía feedback y sugerencias en GitHub",

        // Footer
        "footer.disclaimer": "No recopilamos cookies, el arte es generado por IA y este homenaje gratuito mantiene vivo el espíritu de Lupus In Tabula para que los amigos jueguen sin cartas físicas.",
        "footer.license": "Publicado bajo la licencia MIT por n0tsosmart.",

        // Voting UI
        "votes.label": "Votos",
        "votes.increment": "Añadir voto",
        "votes.decrement": "Quitar voto",
        "menu.voting": "🗳️ Reglas de Votación",
        "voting.title": "Reglas de Votación",
        "voting.indiziatoTitle": "Sospechosos",
        "voting.indiziatoBody": "Los dos jugadores con más votos se convierten en sospechosos. En caso de empate, el moderador pregunta a cada jugador comenzando por el que está a la izquierda del que tiene la carta '¡Bienvenido!' (en sentido horario).",
        "voting.lynchTitle": "Linchamiento",
        "voting.lynchBody": "Solo los jugadores vivos (excluyendo sospechosos y fantasmas) votan para linchar a uno de los sospechosos. El sospechoso con más votos es eliminado.",
        "voting.tieTitle": "Desempate",
        "voting.tieBody": "Si hay un empate durante la votación de linchamiento, el sospechoso más cercano al jugador '¡Bienvenido!' (en sentido horario, comenzando por la izquierda) es eliminado.",
        "voting.ghostTitle": "Fantasmas",
        "voting.ghostBody": "Los fantasmas pueden votar para elegir sospechosos pero no pueden votar en el linchamiento.",
    },

    // --------------------------------------------------------------------------
    // Italian (it) Translations
    // --------------------------------------------------------------------------
    it: {
        // Header Section
        "header.label": "UN TRIBUTO A LUPUS IN TABULA",
        "header.title": "Slay the Werewolf",
        "header.tagline1": "Ricordati di uccidere il lupo.",

        // Global Buttons
        "buttons.restart": "🔄 Nuova partita",
        "buttons.addPlayer": "Aggiungi",
        "buttons.clearPlayers": "Svuota elenco",
        "buttons.lynch": "🔥 Lincia",
        "buttons.deal": "🎴 Distribuisci le carte",
        "buttons.showCard": "👁️ Mostra carta",
        "buttons.nextPlayer": "➡️ Giocatore successivo",
        "buttons.handoff": "Sono il narratore",
        "buttons.hidePlayers": "Nascondi giocatori",
        "buttons.showPlayers": "Mostra giocatori",
        "buttons.revive": "Rianima",
        "buttons.locked": "Bloccato",
        "buttons.nextDay": "Giorno successivo",
        "buttons.noMoreDays": "Niente altri giorni",
        "buttons.toggleGuide": "Mostra elenco",
        "buttons.showList": "Mostra elenco",
        "buttons.stepMode": "Modalità passi",
        "buttons.prevStep": "⬅️ Indietro",
        "buttons.nextStep": "Avanti ➡️",
        "buttons.eliminate": "🐺 Sbranato",
        "buttons.eliminateNight": "Eliminato",
        "buttons.newMatch": "🎮 Nuova partita",
        "buttons.finalNew": "🔁 Nuova partita",
        "buttons.showSummary": "📜 Mostra riepilogo",

        // Language Picker
        "language.label": "Lingua",

        // Setup Screen
        "setup.title": "⚙️ Preparazione",
        "setup.playersLabel": "Numero di giocatori",
        "setup.playersHelp": "Servono almeno 5 giocatori, max 24 giocatori",
        "setup.wolvesLabel": "Lupi mannari",
        "setup.namesLabel": "👥 Nomi dei giocatori (opzionale)",
        "setup.namesHelp": "Manteniamo questo elenco anche iniziando una nuova partita.",
        "setup.namesPlaceholder": "es. Marco",
        "setup.wolfHint": "Lupi calcolati automaticamente (personalizzabili: massimo 3)",
        "setup.reorderHint": "Trascina e rilascia per riordinare i giocatori",
        "setup.specialsTitle": "✨ Ruoli speciali",
        "setup.specialsHelp": "Il Veggente è sempre incluso!",
        "setup.rolesSummary": "Composizione ruoli",
        "setup.rolesInDeck": "{count}× {role}",

        // Role-related messages
        "roles.availableFrom": "Consigliato da {count}+ giocatori.",
        "roles.masonNote": "Aggiungi sempre entrambe le carte.",

        // Reveal Phase
        "reveal.title": "🔐 Distribuzione segreta",
        "reveal.hiddenTeam": "Carta coperta",
        "reveal.tap": "Tocca per rivelare",
        "reveal.prompt": "Assicurati che nessun altro stia guardando",

        // Handoff Notice
        "handoffNotice.title": "⚠️ Passa il dispositivo al narratore",
        "handoffNotice.body": "Quando tutti hanno visto la carta, consegna il dispositivo al narratore prima del Giorno 1.",
        "handoffNotice.timer": "Attendi {seconds}s prima di continuare",

        // Narrator Summary Screen
        "summary.title": "📋 Riepilogo narratore",
        "log.title": "Eliminazioni",
        "log.empty": "Nessun giocatore eliminato",
        "log.entry": "{name} ({role}) è stato eliminato al Giorno {day}",
        "log.unknownRole": "ruolo sconosciuto",
        "fallen.title": "🪦 Giocatori caduti",
        "fallen.empty": "Nessuna morte confermata",
        "fallen.pending": "(in attesa di risoluzione)",
        "living.title": "👥 Giocatori vivi",
        "living.empty": "Nessun giocatore disponibile",

        // Mythomaniac Role
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

        // Day Cycle
        "day.label": "Giorno attuale",

        // Narrator Guide
        "guide.title": "Guida",
        "guide.progress": "Passo {current} / {total}",
        "guide.empty": "Nessuna istruzione per questo giorno.",
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

        // Elimination & Revive
        "elimination.title": "Elimina un giocatore",
        "elimination.placeholder": "Seleziona un giocatore",
        "elimination.none": "Nessun giocatore vivo",

        // Final View / Victory Screen
        "final.title": "Vittoria",
        "victory.village.title": "Il villaggio trionfa",
        "victory.village.subtitle": "Tutti i lupi sono stati eliminati. Il villaggio può riposare.",
        "victory.wolves.title": "I lupi mannari conquistano Tabula",
        "victory.wolves.subtitle": "Il branco è ormai forte quanto i villici. Non c'è scampo.",
        "victory.hamster.title": "Il Criceto Mannaro sopravvive",
        "victory.hamster.subtitle": "La piccola bestia sopravvive a tutti e vince da sola.",

        // Modals
        "modal.title": "Conferma",
        "modal.cancel": "Annulla",
        "modal.confirm": "Conferma",

        // Error Messages
        "errors.minPlayers": "⚠️ Servono almeno {count} giocatori",
        "errors.needWolf": "⚠️ Serve almeno un lupo mannaro",
        "errors.tooManyWolves": "⚠️ I lupi devono essere meno dei giocatori",
        "errors.tooManySpecials": "⚠️ Troppi ruoli speciali per questo gruppo",

        // Status Messages
        "status.player": "Giocatore {current} / {total}",
        "status.defaultPlayer": "Giocatore {number}",
        "status.indiziato": "Indiziato",
        "status.benvenuto": "Benvenuto!",

        // Game Messages
        "messages.ready": "Pronti a rivelare",
        "messages.ensureAlone": "Assicurati che nessuno stia guardando",
        "messages.completionTitle": "Pronti a giocare",
        "messages.completionProgress": "Distribuzione completata",
        "messages.everyoneReady": "Tutti hanno visto la carta",
        "messages.completionBody": "Passa il dispositivo al narratore per iniziare il Giorno 1.",

        // Confirmation Prompts
        "confirmation.newGame": "Iniziare una nuova partita?",
        "confirmation.restart": "Riavviare la configurazione?",
        "confirmation.nextDay": "Passare al Giorno {day}? Assicurati che tutti abbiano gli occhi chiusi.",
        "confirmation.eliminationVictory": "Eliminare {player} farà scattare {outcome}. Vuoi procedere?",
        "confirmation.lynch": "Sei sicuro di voler linciare {player}?",
        "confirmation.handoff": "Pronto a mostrare il riepilogo? Conferma di essere il narratore e che nessun altro stia guardando.",

        // Accessibility Labels
        "accessibility.removePlayer": "Rimuovi {name}",
        "accessibility.movePlayerUp": "Sposta {name} in alto",
        "accessibility.movePlayerDown": "Sposta {name} in basso",

        // Info & Rules
        "info.button": "📖 Suggerimenti di immersione e regole",
        "info.title": "Mantieni vivo il mistero del villaggio",
        "info.roleplayTitle": "Suggerimenti di interpretazione",
        "info.roleplayPlayers": "Giocatori: parlate come i vostri personaggi, sussurrate i sospetti e descrivete gesti senza accennare a dettagli meta come “ero stato pescato per terzo”.",
        "info.roleplayNarrator": "Narratore: descrivi suoni, odori e luci prima di ogni fase e chiama i ruoli per titolo. Se la tensione svanisce, fermati e riportate tutti nell'atmosfera.",
        "info.rulesTitle": "Regole e metagioco",
        "info.rulesSummary": "Niente foto, registrazioni o discussioni fuori tavolo. Chi viene eliminato resta in silenzio finché un potere non lo richiama.",
        "info.rulesMetagame": "Promemoria metagame: niente colpetti in codice, ricerche al telefono o riferimenti all'ordine delle carte. Il narratore può ripetere una fase se la immersione si rompe.",
        "info.feedback": "💬 Invia feedback e suggerimenti su GitHub",

        // Footer
        "footer.disclaimer": "Non raccogliamo cookie, le illustrazioni sono generate da IA e questo tributo gratuito mantiene vivo lo spirito di Lupus In Tabula per giocare tra amici senza carte fisiche.",
        "footer.license": "Distribuito con licenza MIT da n0tsosmart.",

        // Voting UI
        "votes.label": "Voti",
        "votes.increment": "Aggiungi voto",
        "votes.decrement": "Rimuovi voto",
        "menu.voting": "🗳️ Regole di Voto",
        "voting.title": "Regole di Voto",
        "voting.indiziatoTitle": "Indiziati",
        "voting.indiziatoBody": "I due giocatori con più voti diventano indiziati. In caso di parità, il moderatore chiede a ogni giocatore, partendo da chi è a sinistra di quello che ha il 'Benvenuto!' (in senso orario).",
        "voting.lynchTitle": "Linciaggio",
        "voting.lynchBody": "Solo i giocatori vivi (esclusi indiziati e fantasmi) votano per linciare uno degli indiziati. L'indiziato con più voti viene eliminato.",
        "voting.tieTitle": "Spareggio",
        "voting.tieBody": "Se c'è parità durante il voto di linciaggio, l'indiziato più vicino al giocatore 'Benvenuto!' (in senso orario, partendo da sinistra) viene eliminato.",
        "voting.ghostTitle": "Fantasmi",
        "voting.ghostBody": "I fantasmi possono votare per scegliere gli indiziati ma non possono votare per il linciaggio.",
    },
};
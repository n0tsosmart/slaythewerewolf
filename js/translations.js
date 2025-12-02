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
                "buttons.lynch": "🔥 Lynch",
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
                "buttons.back": "← Back",
                "buttons.cancel": "Cancel",
                "buttons.confirm": "Confirm",

                // Language Picker
                "language.label": "Language",
                "theme.label": "Theme",
                "theme.mafia": "Mafia Edition",
                "mafiaWarning.title": "Warning",
                "mafiaWarning.message": "Changing the theme will refresh the page and reset the current game.",

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
                "setup.specialsHelp": "The Seer is always included.",
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
                "errors.playerCountMismatch": "⚠️ Player count mismatch: expected {count}, but have {current}",
                "errors.nameTaken": "Name '{name}' is already taken.",

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
                "footer.donate": "❤️ Support this project",

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

                // Landing View
                "landing.title": "Welcome",
                "landing.subtitle": "Choose your game mode",
                "landing.localGame": "Local Game",
                "landing.localDesc": "Pass one device around",
                "landing.onlineGame": "Online Game",
                "landing.onlineDesc": "Join with multiple devices",

                // Lobby View
                "lobby.title": "Online Game",
                "lobby.hostGame": "Host Game",
                "lobby.or": "OR",
                "lobby.joinGame": "Join Game",
                "lobby.roomCodePlaceholder": "Room Code",
                "lobby.yourNamePlaceholder": "Your Name",
                "lobby.shareCode": "Share this code with your friends:",
                "lobby.playersInRoom": "Players in room:",
                "lobby.startGame": "Start Game",
                "lobby.narratorPlayerName": "Narrator (You)",
                "lobby.you": "You",
                "lobby.joinedAs": "Joined as:",
                "lobby.waitingForHost": "Waiting for host to start the game...",
                "lobby.confirmLeave": "Are you sure you want to leave this game?",
                "lobby.confirmBack": "Are you sure you want to go back? You will leave the current lobby.",
                "lobby.confirmCancel": "Are you sure you want to cancel the room? All connected players will be disconnected.",

                // Client Role View
                "clientRole.title": "Your Role",
                "clientRole.imageAlt": "Role image",
                "clientRole.noRoleAssigned": "No role assigned yet",
                "clientRole.unknownRole": "Unknown Role",
                "clientRole.returnToLobby": "Exit",

                // Network Messages (Toasts)
                "network.peerError": "Connection problem. Please try again.",
                "network.connectionError": "Lost connection with player.",
                "network.hostConnectionError": "Could not connect to host.",
                "network.roomDoesNotExist": "Room not found. Check the code.",
                "network.joinError": "Could not join game. Try again.",
                "network.connectionTimeout": "Connection timed out.",
                // General
                "general.betaBadge": "BETA",
                "network.playerJoined": "{name} joined the game.",
                "network.playerLeft": "{name} left the game.",
                "network.welcomeClient": "Welcome to the game!",
                "network.gameStarted": "Host started the game!",
                "network.gameStartedByHost": "Game started. Distributing roles...",
                "network.receivedRole": "You received your role!",
                "network.hostCancelled": "Game cancelled by host.",
                "network.hostDisconnected": "Host disconnected. Returning to match selection.",
                "network.disconnected": "Disconnected from the network.",
                "network.roomCodeAndNameRequired": "Room code and your name are required.",
                "network.needAtLeastOnePlayer": "Need at least one player to start the game.",
                "network.rejoiningGame": "Rejoining game as {name}...",
                "network.couldNotRejoin": "Could not rejoin game. Please try again.",
                "network.leftGame": "You left the game.",

                // Menu
                "menu.donate": "❤️ Support this project",

                // Privacy Policy
                "footer.privacy": "🔒 Privacy & Data Policy",
                "privacy.title": "Privacy & Data Policy",
                "privacy.intro": "This application is designed with privacy in mind. Here's how we handle your data:",
                "privacy.localTitle": "Local Storage Only",
                "privacy.localDesc": "All game data (player names, game state, language preferences) is stored locally in your browser using LocalStorage. No data is sent to any external servers or third parties.",
                "privacy.noCookiesTitle": "No Tracking or Cookies",
                "privacy.noCookiesDesc": "We do not use cookies, analytics, or any tracking mechanisms. Your gameplay is completely private.",
                "privacy.peerJsTitle": "Online Mode: WebRTC",
                "privacy.peerJsDesc": "Online mode uses WebRTC for direct peer-to-peer connections. Only game data (roles, names, room codes) is shared between players' browsers. A signaling server facilitates initial connections but doesn't access your data.",
                "privacy.openSourceTitle": "Open Source & Transparent",
                "privacy.openSourceDesc": "This application is open source. You can review the entire codebase on GitHub to verify how data is handled.",
                "privacy.dataDeletionTitle": "Data Deletion",
                "privacy.dataDeletionDesc": "You can clear all stored data at any time by clearing your browser's local storage or cache for this website.",
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
                "buttons.back": "← Volver",
                "buttons.cancel": "Cancelar",
                "buttons.confirm": "Confirmar",
                "buttons.leave": "Salir",

                // Language Picker
                "language.label": "Idioma",
                "theme.label": "Tema",
                "theme.mafia": "Edición Mafia",
                "mafiaWarning.title": "Advertencia",
                "mafiaWarning.message": "Cambiar el tema recargará la página y reiniciará la partida actual.",

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
                "setup.specialsHelp": "El Vidente siempre está incluido.",
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
                "errors.playerCountMismatch": "⚠️ Discrepancia en el número de jugadores: se esperaban {count}, pero hay {current}",
                "errors.nameTaken": "El nombre '{name}' ya está en uso.",

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
                "footer.donate": "❤️ Apoya este proyecto",

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

                // Landing View
                "landing.title": "Bienvenido",
                "landing.subtitle": "Elige tu modo de juego",
                "landing.localGame": "Partida Local",
                "landing.localDesc": "Pasa un dispositivo",
                "landing.onlineGame": "Partida Online",
                "landing.onlineDesc": "Únete con múltiples dispositivos",

                // Lobby View
                "lobby.title": "Partida Online",
                "lobby.hostGame": "Crear Partida",
                "lobby.or": "O",
                "lobby.joinGame": "Unirse a Partida",
                "lobby.roomCodePlaceholder": "Código de Sala",
                "lobby.yourNamePlaceholder": "Tu Nombre",
                "lobby.shareCode": "Comparte este código con tus amigos:",
                "lobby.playersInRoom": "Jugadores en la sala:",
                "lobby.startGame": "Iniciar Partida",
                "lobby.narratorPlayerName": "Narrador (Tú)",
                "lobby.you": "Tú",
                "lobby.joinedAs": "Unido como:",
                "lobby.waitingForHost": "Esperando a que el anfitrión inicie...",
                "lobby.confirmLeave": "¿Estás seguro de que quieres salir de esta partida?",
                "lobby.confirmBack": "¿Estás seguro de que quieres volver? Saldrás del lobby actual.",
                "lobby.confirmCancel": "¿Estás seguro de que quieres cancelar la sala? Todos los jugadores conectados serán desconectados.",

                // Client Role View
                "clientRole.title": "Tu Rol",
                "clientRole.imageAlt": "Imagen del rol",
                "clientRole.noRoleAssigned": "Ningún rol asignado aún",
                "clientRole.unknownRole": "Rol Desconocido",
                "clientRole.returnToLobby": "Salir",

                // Network Messages (Toasts)
                "network.peerError": "Problema de conexión. Inténtalo de nuevo.",
                "network.connectionError": "Conexión perdida con el jugador.",
                "network.hostConnectionError": "No se pudo conectar con el anfitrión.",
                "network.roomDoesNotExist": "Sala no encontrada. Verifica el código.",
                "network.joinError": "No se pudo unir a la partida. Inténtalo de nuevo.",
                "network.connectionTimeout": "Tiempo de espera de conexión agotado.",
                "general.betaBadge": "BETA",
                "network.playerJoined": "{name} se unió a la partida.",
                "network.playerLeft": "{name} dejó la partida.",
                "network.welcomeClient": "¡Bienvenido a la partida!",
                "network.gameStarted": "¡El anfitrión inició la partida!",
                "network.gameStartedByHost": "Partida iniciada. Distribuyendo roles...",
                "network.receivedRole": "¡Recibiste tu rol!",
                "network.hostCancelled": "Partida cancelada por el anfitrión.",
                "network.hostDisconnected": "Anfitrión desconectado. Volviendo a la selección.",
                "network.disconnected": "Desconectado de la red.",
                "network.roomCodeAndNameRequired": "Se requiere código de sala y tu nombre.",
                "network.needAtLeastOnePlayer": "Se necesita al menos un jugador para comenzar.",
                "network.rejoiningGame": "Reuniéndose a la partida como {name}...",
                "network.couldNotRejoin": "No se pudo reunir a la partida. Inténtalo de nuevo.",
                "network.leftGame": "Has salido de la partida.",

                // Menu
                "menu.donate": "❤️ Apoya este proyecto",

                // Privacy Policy
                "footer.privacy": "🔒 Política de Privacidad y Datos",
                "privacy.title": "Política de Privacidad y Datos",
                "privacy.intro": "Esta aplicación está diseñada pensando en la privacidad. Así es como manejamos tus datos:",
                "privacy.localTitle": "Solo Almacenamiento Local",
                "privacy.localDesc": "Todos los datos del juego (nombres de jugadores, estado del juego, preferencias de idioma) se almacenan localmente en tu navegador usando LocalStorage. No se envían datos a servidores externos ni a terceros.",
                "privacy.noCookiesTitle": "Sin Rastreo ni Cookies",
                "privacy.noCookiesDesc": "No utilizamos cookies, análisis ni mecanismos de rastreo. Tu juego es completamente privado.",
                "privacy.peerJsTitle": "Modo Online: WebRTC",
                "privacy.peerJsDesc": "El modo online usa WebRTC para conexiones directas peer-to-peer. Solo se comparten datos del juego (roles, nombres, códigos) entre navegadores. Un servidor de señalización facilita la conexión inicial sin acceder a tus datos.",
                "privacy.openSourceTitle": "Código Abierto y Transparente",
                "privacy.openSourceDesc": "Esta aplicación es de código abierto. Puedes revisar todo el código en GitHub para verificar cómo se manejan los datos.",
                "privacy.dataDeletionTitle": "Eliminación de Datos",
                "privacy.dataDeletionDesc": "Puedes borrar todos los datos almacenados en cualquier momento limpiando el almacenamiento local o la caché de tu navegador para este sitio web.",
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
                "buttons.back": "← Indietro",
                "buttons.cancel": "Annulla",
                "buttons.confirm": "Conferma",
                "buttons.leave": "Esci",

                // Language Picker
                "language.label": "Lingua",
                "theme.label": "Tema",
                "theme.mafia": "Edizione Mafia",
                "mafiaWarning.title": "Attenzione",
                "mafiaWarning.message": "Cambiare il tema ricaricherà la pagina e resetterà la partita corrente.",

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
                "errors.playerCountMismatch": "⚠️ Discrepanza nel numero di giocatori: attesi {count}, ma presenti {current}",
                "errors.nameTaken": "Il nome '{name}' è già in uso.",

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
                "footer.donate": "❤️ Sostieni questo progetto",

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

                // Landing View
                "landing.title": "Benvenuto",
                "landing.subtitle": "Scegli la modalità di gioco",
                "landing.localGame": "Partita Locale",
                "landing.localDesc": "Passa un dispositivo",
                "landing.onlineGame": "Partita Online",
                "landing.onlineDesc": "Unisciti con più dispositivi",

                // Lobby View
                "lobby.title": "Partita Online",
                "lobby.hostGame": "Crea Partita",
                "lobby.or": "O",
                "lobby.joinGame": "Unisciti a Partita",
                "lobby.roomCodePlaceholder": "Codice Stanza",
                "lobby.yourNamePlaceholder": "Il Tuo Nome",
                "lobby.shareCode": "Condividi questo codice con i tuoi amici:",
                "lobby.playersInRoom": "Giocatori nella stanza:",
                "lobby.startGame": "Inizia Partita",
                "lobby.narratorPlayerName": "Narratore (Tu)",
                "lobby.you": "Tu",
                "lobby.joinedAs": "Unito come:",
                "lobby.waitingForHost": "In attesa che l'host inizi...",
                "lobby.confirmLeave": "Sei sicuro di voler lasciare questa partita?",
                "lobby.confirmBack": "Sei sicuro di voler tornare indietro? Uscirai dalla lobby corrente.",
                "lobby.confirmCancel": "Sei sicuro di voler cancellare la stanza? Tutti i giocatori connessi verranno disconnessi.",

                // Client Role View
                "clientRole.title": "Il Tuo Ruolo",
                "clientRole.imageAlt": "Immagine del ruolo",
                "clientRole.noRoleAssigned": "Nessun ruolo assegnato ancora",
                "clientRole.unknownRole": "Ruolo Sconosciuto",
                "clientRole.returnToLobby": "Esci",

                // Network Messages (Toasts)
                "network.peerError": "Problema di connessione. Riprova.",
                "network.connectionError": "Connessione persa con il giocatore.",
                "network.hostConnectionError": "Impossibile connettersi all'host.",
                "network.roomDoesNotExist": "Stanza non trovata. Controlla il codice.",
                "network.joinError": "Impossibile unirsi alla partita. Riprova.",
                "network.connectionTimeout": "Timeout della connessione.",
                "general.betaBadge": "BETA",
                "network.playerJoined": "{name} si è unito alla partita.",
                "network.playerLeft": "{name} ha lasciato la partita.",
                "network.welcomeClient": "Benvenuto nella partita!",
                "network.gameStarted": "L'host ha iniziato la partita!",
                "network.gameStartedByHost": "Partida iniziata. Distribuzione ruoli...",
                "network.receivedRole": "Hai ricevuto il tuo ruolo!",
                "network.hostCancelled": "Partita annullata dall'host.",
                "network.hostDisconnected": "Host disconnesso. Ritorno alla selezione.",
                "network.disconnected": "Disconnesso dalla rete.",
                "network.roomCodeAndNameRequired": "Codice stanza e nome richiesti.",
                "network.needAtLeastOnePlayer": "Serve almeno un giocatore per iniziare.",
                "network.rejoiningGame": "Rientro in partita come {name}...",
                "network.couldNotRejoin": "Impossibile rientrare in partita. Riprova.",
                "network.leftGame": "Hai lasciato la partita.",

                // Menu
                "menu.donate": "❤️ Sostieni questo progetto",

                // Privacy Policy
                "footer.privacy": "🔒 Privacy e Dati",
                "privacy.title": "Privacy e Dati",
                "privacy.intro": "Questa applicazione è progettata pensando alla privacy. Ecco come gestiamo i tuoi dati:",
                "privacy.localTitle": "Solo Archiviazione Locale",
                "privacy.localDesc": "Tutti i dati di gioco (nomi dei giocatori, stato del gioco, preferenze della lingua) sono archiviati localmente nel tuo browser utilizzando LocalStorage. Nessun dato viene inviato a server esterni o terze parti.",
                "privacy.noCookiesTitle": "Nessun Tracciamento o Cookie",
                "privacy.noCookiesDesc": "Non utilizziamo cookie, analisi o meccanismi di tracciamento. Il tuo gioco è completamente privato.",
                "privacy.peerJsTitle": "Modalità Online: WebRTC",
                "privacy.peerJsDesc": "La modalità online usa WebRTC per connessioni dirette peer-to-peer. Solo i dati di gioco (ruoli, nomi, codici) sono condivisi tra i browser. Un server di segnalazione facilita la connessione iniziale senza accedere ai tuoi dati.",
                "privacy.openSourceTitle": "Open Source e Trasparente",
                "privacy.openSourceDesc": "Questa applicazione è open source. Puoi esaminare l'intero codice su GitHub per verificare come vengono gestiti i dati.",
                "privacy.dataDeletionTitle": "Cancellazione dei Dati",
                "privacy.dataDeletionDesc": "Puoi cancellare tutti i dati archiviati in qualsiasi momento cancellando l'archiviazione locale o la cache del browser per questo sito web.",
        },

        // --------------------------------------------------------------------------
        // Mafia Edition Overrides
        // --------------------------------------------------------------------------
        mafia: {
                en: {
                        "header.tagline1": "Remember to eliminate the mafia.",
                        "buttons.lynch": "⚖️ Arrest",
                        "buttons.eliminate": "🔫 Shot",
                        "setup.wolvesLabel": "Mafiosi",
                        "setup.wolfHint": "Automatically calculated mafiosi (customizable: up to 3)",
                        "setup.specialsHelp": "The Detective is always included.",
                        "guide.step.wolves": "Call the Mafia to choose their victim.",
                        "guide.step.seer": "Call the Detective and reveal the vision.",
                        "guide.step.bodyguard": "Call the Doctor to choose someone to protect.",
                        "guide.step.medium": "Call the Coroner and reveal whether the previous arrest was a mafioso.",
                        "guide.step.owl": "Call the Journalist to mark the nominated player.",
                        "guide.step.owlReveal": "Reveal the Journalist's chosen player before the discussion.",
                        "guide.step.mythomaniac": "Remind the Impostor to pick a role to mimic.",
                        "guide.step.possessed": "Keep in mind there may be a Corrupt Politician ally.",
                        "guide.step.masons": "Call the Unionists so they recognize each other.",
                        "guide.step.hamster": "Remember the Rat is immune to mafia and only dies to the Detective.",
                        "myth.result.wolf": "{name} now joins the mafia after copying {target}.",
                        "myth.result.seer": "{name} inherits the Detective’s power after copying {target}.",
                        "myth.result.human": "{name} stays citizen after copying {target}.",
                        "victory.hamster.title": "The Rat survives",
                        "victory.hamster.subtitle": "The snitch outlives everyone and wins alone.",
                        "victory.village.title": "The city prevails",
                        "victory.village.subtitle": "All mafiosi have been arrested. The city is safe.",
                        "victory.wolves.title": "The Mafia conquers the city",
                        "victory.wolves.subtitle": "The crime family is now as strong as the citizens. There is no escape.",
                        "voting.lynchTitle": "Arrest",
                        "voting.lynchBody": "Only living players (excluding suspects and ghosts) vote to arrest one of the suspects. The suspect with the most votes is arrested.",
                        "guide.step.dayDiscuss": "Day {day}: let the city discuss and then collect votes for the arrest.",
                        "guide.step.dawn": "Morning {day}: announce the victims of the mafia.",
                        "confirmation.lynch": "Are you sure you want to arrest {player}?",
                        "voting.tieBody": "If there is a tie during the arrest vote, the suspect closest to the 'Welcome!' player (clockwise, starting from the left) is arrested.",
                        "roles": {
                                "werewolf": { "name": "Mafioso", "teamLabel": "Mafiosi", "description": "Each night the mafiosi meet and choose a victim. They win when the family is as numerous as the citizens." },
                                "villager": { "name": "Citizen", "teamLabel": "Citizens", "description": "No special power: discuss, observe, and vote to expose the mafiosi. You win when no mafiosi remain." },
                                "seer": { "name": "Detective", "teamLabel": "Citizens", "description": "Each night you investigate a player and learn whether they are mafia/rat or citizen. Share information carefully." },
                                "medium": { "name": "Coroner", "teamLabel": "Citizens", "description": "From the second night on, learn whether the player arrested the previous day was a mafioso." },
                                "possessed": { "name": "Corrupt Politician", "teamLabel": "Mafia Ally", "description": "You are a citizen but secretly support the mafia without knowing who they are. Win only if the mafia dominates." },
                                "bodyguard": { "name": "Doctor", "teamLabel": "Citizens", "description": "Each night before the mafia attack you protect one player. If targeted, they survive." },
                                "owl": { "name": "Journalist", "teamLabel": "Citizens", "description": "Each night you mark a suspect. That player is automatically nominated and with 20+ players dies if they are not Mafia/Rat." },
                                "mason": { "name": "Unionist", "teamLabel": "Citizens", "description": "Always in pairs: on the first night you open your eyes and recognize each other as allies." },
                                "werehamster": { "name": "Rat", "teamLabel": "Introvert", "description": "You only want to survive. Immune to mafia attacks but the Detective kills you if they investigate you. Win alone if you live to the end." },
                                "mythomaniac": { "name": "Impostor", "teamLabel": "Citizens", "description": "At the end of the second night choose a player: if they are Mafia you become one, if they are the Detective you inherit the power, otherwise you remain citizen." }
                        }
                },
                es: {
                        "header.tagline1": "Recuerda eliminar a la mafia.",
                        "buttons.lynch": "⚖️ Arrestar",
                        "buttons.eliminate": "🔫 Disparado",
                        "setup.wolvesLabel": "Mafiosos",
                        "setup.wolfHint": "Mafiosos calculados automáticamente (personalizables: máximo 3)",
                        "setup.specialsHelp": "¡El Detective siempre está incluido!",
                        "guide.step.wolves": "Llama a la Mafia para elegir a su víctima.",
                        "guide.step.seer": "Llama al Detective y revela su visión.",
                        "guide.step.bodyguard": "Llama al Doctor para que elija a quién proteger.",
                        "guide.step.medium": "Llama al Forense y di si el arrestado anterior era un mafioso.",
                        "guide.step.owl": "Llama al Periodista para marcar al nominado.",
                        "guide.step.owlReveal": "Revela el nombre marcado por el Periodista antes de la discusión.",
                        "guide.step.mythomaniac": "Recuerda al Impostor que elija a quién imitar.",
                        "guide.step.possessed": "Recuerda que puede haber un Político Corrupto aliado.",
                        "guide.step.masons": "Llama a los Sindicalistas para que se reconozcan.",
                        "guide.step.hamster": "Recuerda que la Rata es inmune a la mafia y solo muere con el Detective.",
                        "myth.result.wolf": "{name} ahora se une a la mafia tras copiar a {target}.",
                        "myth.result.seer": "{name} hereda el poder del Detective tras copiar a {target}.",
                        "myth.result.human": "{name} sigue siendo ciudadano tras copiar a {target}.",
                        "victory.hamster.title": "Triunfa la Rata",
                        "victory.hamster.subtitle": "El soplón sobrevive a todos y gana en solitario.",
                        "victory.village.title": "La ciudad resiste",
                        "victory.village.subtitle": "Todos los mafiosos han sido arrestados. La ciudad está a salvo.",
                        "victory.wolves.title": "La Mafia conquista la ciudad",
                        "victory.wolves.subtitle": "La familia criminal ya es tan fuerte como los ciudadanos. No hay escapatoria.",
                        "voting.lynchTitle": "Arresto",
                        "voting.lynchBody": "Solo los jugadores vivos (excluyendo sospechosos y fantasmas) votan para arrestar a uno de los sospechosos. El sospechoso con más votos es arrestado.",
                        "guide.step.dayDiscuss": "Día {day}: deja que la ciudad discuta y recoge los votos para el arresto.",
                        "guide.step.dawn": "Mañana {day}: anuncia las víctimas de la mafia.",
                        "confirmation.lynch": "¿Estás seguro de que quieres arrestar a {player}?",
                        "voting.tieBody": "Si hay un empate durante la votación de arresto, el sospechoso más cercano al jugador '¡Bienvenido!' (en sentido horario, comenzando por la izquierda) es arrestado.",
                        "roles": {
                                "werewolf": { "name": "Mafioso", "teamLabel": "Mafiosos", "description": "Cada noche los mafiosos se reúnen y eligen una víctima. Ganan cuando la familia es tan numerosa como los ciudadanos." },
                                "villager": { "name": "Ciudadano", "teamLabel": "Ciudadanos", "description": "Sin poder especial: discute, observa y vota para exponer a los mafiosos. Ganas cuando no quedan mafiosos." },
                                "seer": { "name": "Detective", "teamLabel": "Ciudadanos", "description": "Cada noche investigas a un jugador y descubres si es mafia/rata o ciudadano. Comparte la información con cuidado." },
                                "medium": { "name": "Forense", "teamLabel": "Ciudadanos", "description": "Desde la segunda noche, descubre si el jugador arrestado el día anterior era un mafioso." },
                                "possessed": { "name": "Político Corrupto", "teamLabel": "Aliado de la mafia", "description": "Eres ciudadano pero apoyas en secreto a la mafia sin saber quiénes son. Ganas solo si la mafia domina." },
                                "bodyguard": { "name": "Doctor", "teamLabel": "Ciudadanos", "description": "Cada noche antes del ataque de la mafia proteges a un jugador. Si es atacado, sobrevive." },
                                "owl": { "name": "Periodista", "teamLabel": "Ciudadanos", "description": "Cada noche marcas a un sospechoso. Ese jugador queda nominado y con 20+ jugadores muere si no es Mafia/Rata." },
                                "mason": { "name": "Sindicalista", "teamLabel": "Ciudadanos", "description": "Siempre en pareja: la primera noche abrís los ojos y os reconocéis como aliados." },
                                "werehamster": { "name": "Rata", "teamLabel": "Introvertido", "description": "Solo quieres sobrevivir. Inmune a los ataques de la mafia pero el Detective te mata si te investiga. Ganas solo si vives hasta el final." },
                                "mythomaniac": { "name": "Impostor", "teamLabel": "Ciudadanos", "description": "Al final de la segunda noche elige a un jugador: si es Mafia te conviertes en uno, si es Detective heredas su poder, de lo contrario sigues como ciudadano." }
                        }
                },
                it: {
                        "header.tagline1": "Ricordati di eliminare la mafia.",
                        "buttons.lynch": "⚖️ Arresta",
                        "buttons.eliminate": "🔫 Sparato",
                        "setup.wolvesLabel": "Mafiosi",
                        "setup.wolfHint": "Mafiosi calcolati automaticamente (personalizzabili: massimo 3)",
                        "setup.specialsHelp": "Il Detective è sempre incluso!",
                        "guide.step.wolves": "Chiama la Mafia per scegliere la vittima.",
                        "guide.step.seer": "Chiama il Detective e rivela la visione.",
                        "guide.step.bodyguard": "Chiama il Dottore per decidere chi proteggere.",
                        "guide.step.medium": "Chiama il Medico Legale e svela se l'arrestato precedente era un mafioso.",
                        "guide.step.owl": "Chiama il Giornalista per segnare il sospetto.",
                        "guide.step.owlReveal": "Rivela il nome segnato dal Giornalista prima della discussione.",
                        "guide.step.mythomaniac": "Ricorda all'Impostore di scegliere un ruolo da imitare.",
                        "guide.step.possessed": "Ricorda che potrebbe esserci un Politico Corrotto alleato.",
                        "guide.step.masons": "Chiama i Sindacalisti perché si riconoscano.",
                        "guide.step.hamster": "Ricorda che il Ratto è immune alla mafia e muore solo col Detective.",
                        "myth.result.wolf": "{name} ora si unisce alla mafia dopo aver copiato {target}.",
                        "myth.result.seer": "{name} eredita il potere del Detective dopo aver copiato {target}.",
                        "myth.result.human": "{name} resta cittadino dopo aver copiato {target}.",
                        "victory.hamster.title": "Il Ratto sopravvive",
                        "victory.hamster.subtitle": "La spia sopravvive a tutti e vince da sola.",
                        "victory.village.title": "La città trionfa",
                        "victory.village.subtitle": "Tutti i mafiosi sono stati arrestati. La città è salva.",
                        "victory.wolves.title": "La Mafia conquista la città",
                        "victory.wolves.subtitle": "La famiglia criminale è ormai forte quanto i cittadini. Non c'è scampo.",
                        "voting.lynchTitle": "Arresto",
                        "voting.lynchBody": "Solo i giocatori vivi (esclusi indiziati e fantasmi) votano per arrestare uno degli indiziati. L'indiziato con più voti viene arrestato.",
                        "guide.step.dayDiscuss": "Giorno {day}: lascia discutere la città e raccogli i voti per l'arresto.",
                        "guide.step.dawn": "Mattina {day}: annuncia le vittime della mafia.",
                        "confirmation.lynch": "Sei sicuro di voler arrestare {player}?",
                        "voting.tieBody": "Se c'è parità durante il voto di arresto, l'indiziato più vicino al giocatore 'Benvenuto!' (in senso orario, partendo da sinistra) viene arrestato.",
                        "roles": {
                                "werewolf": { "name": "Mafioso", "teamLabel": "Mafiosi", "description": "Ogni notte i mafiosi si riuniscono e scelgono una vittima. Vincono quando la famiglia è numerosa quanto i cittadini." },
                                "villager": { "name": "Cittadino", "teamLabel": "Cittadini", "description": "Nessun potere speciale: discuti, osserva e vota per esporre i mafiosi. Vinci quando non restano mafiosi." },
                                "seer": { "name": "Detective", "teamLabel": "Cittadini", "description": "Ogni notte indaghi su un giocatore e scopri se è mafia/ratto o cittadino. Condividi le informazioni con cautela." },
                                "medium": { "name": "Medico Legale", "teamLabel": "Cittadini", "description": "Dalla seconda notte, scopri se il giocatore arrestato il giorno precedente era un mafioso." },
                                "possessed": { "name": "Politico Corrotto", "teamLabel": "Alleato dei mafiosi", "description": "Sei cittadino ma sostieni segretamente la mafia senza sapere chi siano. Vinci solo se la mafia domina." },
                                "bodyguard": { "name": "Dottore", "teamLabel": "Cittadini", "description": "Ogni notte prima dell'attacco della mafia proteges un giocatore. Se viene colpito, sopravvive." },
                                "owl": { "name": "Giornalista", "teamLabel": "Cittadini", "description": "Ogni notte marchi un sospetto. Quel giocatore è automaticamente nominato e con 20+ giocatori muore se non è Mafia/Ratto." },
                                "mason": { "name": "Sindacalista", "teamLabel": "Cittadini", "description": "Sempre in coppia: la prima notte aprite gli occhi e vi riconoscete come alleati." },
                                "werehamster": { "name": "Ratto", "teamLabel": "Introverso", "description": "Vuoi solo sopravvivere. Immune agli attacchi della mafia ma il Detective ti uccide se ti indaga. Vinci da solo se resti in vita fino alla fine." },
                                "mythomaniac": { "name": "Impostore", "teamLabel": "Cittadini", "description": "Alla fine della seconda notte scegli un giocatore: se è Mafia lo diventi, se è il Detective erediti il potere, altrimenti rimani cittadino." }
                        }
                }
        }
};
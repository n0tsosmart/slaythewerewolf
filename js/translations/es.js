/**
 * @fileoverview Spanish translations for Slay the Werewolf
 * Version: 1.1.6
 */
export const es = {
    // Header Section
    "header.label": "UN HOMENAJE A LUPUS IN TABULA",
    "header.title": "Slay the Werewolf",
    "header.tagline1": "Recuerda cazar al lobo.",

    // Global Buttons
    "buttons.restart": "Nueva partida",
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
    "buttons.eliminate": "🐺 Devora",
    "buttons.eliminateNight": "Eliminado",
    "buttons.newMatch": "🎮 Nueva partida",
    "buttons.finalNew": "🔁 Nueva partida",
    "buttons.showSummary": "📜 Ver resumen",
    "buttons.back": "← Volver",
    "buttons.cancel": "Cancelar",
    "buttons.confirm": "Confirmar",
    "buttons.leave": "Salir",
    "buttons.discover": "👁️ Descubrir",
    "buttons.discovered": "Descubierto",

    // Offline
    "offline.indicator": "📴 Sin conexión",
    "offline.onlineDisabled": "El modo online requiere conexión a internet",

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
    "setup.haptics": "Vibración",

    // Balance Indicator
    "balance.wolves": "🔴 Favorece a Lobos",
    "balance.village": "🔵 Favorece al Pueblo",
    "balance.balanced": "🟢 Equilibrado",

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
    "day.label": "Día",
    "day.tooltip": "Este es el día actual del juego",
    "day.clickTooltip": "📅 Día {day} del juego",

    // Turn Timer
    "timer.warning30": "⏱️ ¡Quedan 30 segundos!",
    "timer.warning10": "⏱️ ¡Quedan 10 segundos!",
    "timer.complete": "⏰ ¡Se acabó el tiempo!",
    "timer.skipped": "Temporizador omitido",
    "timer.pause": "Pausar",
    "timer.resume": "Reanudar",

    // Narrator Guide
    "guide.title": "Guía de narración",
    "guide.progress": "Paso {current} / {total}",
    "guide.empty": "No hay instrucciones para este día.",
    "guide.step.closeEyes": "🌙 Noche {day} — Pide a todos que cierren los ojos y permanezcan en silencio.",
    "guide.step.masons": "🤝 Llama a los Masones — Abren los ojos, se reconocen en silencio, luego cierran los ojos.",
    "guide.step.bodyguard": "🛡️ Llama al Guardián — Señala al jugador que desea proteger esta noche, luego cierra los ojos.",
    "guide.step.seer": "👁️ Llama al Vidente — Señala a un jugador para investigar. Asiente para hombre lobo, niega para humano.",
    "guide.step.medium": "🔮 Llama al Médium — Revela si el linchado de ayer era un hombre lobo (asiente/niega).",
    "guide.step.owl": "🦉 Llama al Búho — Señala a un jugador para nominar en la discusión de mañana.",
    "guide.step.mythomaniac": "🎭 Mitómano — Esta noche elige a alguien para copiar. La resolución ocurre al amanecer.",
    "guide.step.wolves": "🐺 Llama a los Hombres Lobo — Abren los ojos, eligen una víctima en silencio, luego cierran los ojos.",
    "guide.step.hamster": "🐹 Recuerda: El Hámster Licántropo es inmune a los lobos pero muere instantáneamente si el Vidente lo investiga.",
    "guide.step.dawn": "☀️ Amanecer del Día {day} — Todos abren los ojos. Anuncia dramáticamente las víctimas de la noche.",
    "guide.step.owlReveal": "📰 Revela la nominación del Búho — Este jugador es automáticamente sospechoso para la votación de hoy.",
    "guide.step.possessed": "👤 Recuerda: Un Endemoniado está ayudando secretamente a los lobos sin conocer sus identidades.",
    "guide.step.dayDiscuss": "☀️ Día {day} Discusión — Deja que el pueblo debata, luego recoge los votos para los dos sospechosos.",

    // Elimination & Revive
    "elimination.title": "Elimina a un jugador",
    "elimination.placeholder": "Selecciona un jugador",
    "elimination.none": "No quedan jugadores vivos",
    "elimination.discovered": "{name} fue descubierto por el Vidente y murió instantáneamente",

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
    "status.ghost": "Fantasma",
    "status.ghostTooltip": "Jugador eliminado - puede votar por sospechosos pero debe permanecer en silencio",

    // Ghost/Spectator Mode
    "ghost.reminderTitle": "Reglas del Fantasma",
    "ghost.reminderMessage": "Has sido eliminado. Aún puedes votar para elegir sospechosos, pero no puedes votar en el linchamiento. No debes hablar durante las discusiones y debes cerrar los ojos durante la noche.",
    "ghost.youWere": "Eras un {role}",

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
    "confirmation.immune": "\"{player}\" es inmune a los ataques de los Lobos. ¿Seguro que quieres eliminarlo?",
    "confirmation.lynch": "¿Estás seguro de que quieres linchar a {player}?",
    "confirmation.handoff": "¿Listo para abrir el resumen? Confirma que eres el narrador y que nadie más está mirando.",
    "confirmation.clearPlayers": "¿Borrar todos los nombres?",

    // Browser Compatibility
    "compat.title": "Compatibilidad del Navegador",
    "compat.webrtcWarning": "El modo online requiere WebRTC. Usa un navegador moderno como Chrome, Firefox o Safari.",
    "compat.localStorageWarning": "El progreso no se puede guardar. Habilita cookies/almacenamiento o usa otro navegador.",
    "compat.oldBrowser": "Tu navegador puede no soportar todas las funciones. Considera actualizarlo.",

    // Accessibility Labels
    "accessibility.removePlayer": "Eliminar a {name}",
    "accessibility.movePlayerUp": "Subir a {name}",
    "accessibility.movePlayerDown": "Bajar a {name}",

    // Info & Rules
    "info.button": "📖 Consejos de inmersión y reglas",
    "info.title": "Mantén viva la maldición del pueblo",
    "info.roleplayTitle": "Sugerencias de interpretación",
    "info.roleplayPlayers": "Jugadores: hablad como vuestros personajes, susurrad sospechas y describid gestos sin recurrir a comentarios meta como 'fui el tercero en ser elegido'.",
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
    "menu.rules": "📜 Reglas del juego",
    "rules.title": "Reglas del Juego",
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
    "network.reconnecting": "Reconectando con el anfitrión...",
    "network.reconnectAttempt": "Intento de reconexión {attempt} de {max}...",
    "network.reconnectSuccess": "¡Reconectado exitosamente!",
    "network.reconnectFailed": "No se pudo reconectar. Únete manualmente.",
    "network.connectionLost": "Conexión perdida. Intentando reconectar...",
    "network.rejoinAccepted": "¡Bienvenido de vuelta, {name}!",
    "network.rejoinRejected": "No se pudo reunirse: {reason}",
    "network.playerNotInGame": "No eres parte de esta partida.",
    "clientRole.connectionStatus": "Conexión:",
    "clientRole.statusConnected": "Conectado",
    "clientRole.statusReconnecting": "Reconectando...",
    "clientRole.statusDisconnected": "Desconectado",

    // Menu
    "menu.install": "📱 Instalar App",
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

    // Tutorial
    "tutorial.title": "Cómo Jugar",
    "tutorial.skip": "Omitir",
    "tutorial.prev": "← Atrás",
    "tutorial.next": "Siguiente →",
    "tutorial.done": "¡A Jugar!",
    "tutorial.step1.title": "Bienvenido a Slay the Werewolf",
    "tutorial.step1.desc": "Un juego de deducción social donde los aldeanos deben encontrar y eliminar a los licántropos ocultos entre ellos antes de que sea demasiado tarde.",
    "tutorial.step2.title": "Configura la partida",
    "tutorial.step2.desc": "Elige el número de jugadores (5-24), añade roles especiales opcionales y opcionalmente ingresa nombres para facilitar el seguimiento.",
    "tutorial.step3.title": "Reparte las cartas",
    "tutorial.step3.desc": "Pasa el dispositivo para que cada jugador vea su rol en secreto. ¡Solo tú sabes quién eres!",
    "tutorial.step4.title": "Fase nocturna",
    "tutorial.step4.desc": "Todos cierran los ojos. El narrador guía a los roles especiales para despertar y usar sus poderes. Los lobos eligen una víctima.",
    "tutorial.step5.title": "Fase diurna",
    "tutorial.step5.desc": "¡Discute y debate! El pueblo vota para linchar a un sospechoso. Usa los botones de votación para seguir a los acusados.",
    "tutorial.step6.title": "Gana la partida",
    "tutorial.step6.desc": "El pueblo gana cuando todos los lobos son eliminados. Los lobos ganan cuando igualan a los aldeanos restantes.",
    "menu.tutorial": "📖 Cómo Jugar",
};

/**
 * Spanish Mafia theme overrides
 */
export const esMafia = {
    "balance.wolves": "🔴 Favorece a la Mafia",
    "balance.village": "🔵 Favorece a Ciudadanos",
    "header.tagline1": "Recuerda eliminar a la mafia.",
    "buttons.lynch": "⚖️ Arrestar",
    "buttons.eliminate": "🔫 Dispara",
    "setup.wolvesLabel": "Mafiosos",
    "setup.wolfHint": "Mafiosos calculados automáticamente (personalizables: máximo 3)",
    "setup.specialsHelp": "¡El Detective siempre está incluido!",
    "guide.step.wolves": "🔫 Llama a la Mafia — Abren los ojos, eligen una víctima en silencio, luego cierran los ojos.",
    "guide.step.seer": "🔍 Llama al Detective — Señala a un jugador para investigar. Asiente para mafioso, niega para ciudadano.",
    "guide.step.bodyguard": "💉 Llama al Doctor — Señala al jugador que desea proteger esta noche, luego cierra los ojos.",
    "guide.step.medium": "🧪 Llama al Forense — Revela si el arrestado de ayer era un mafioso (asiente/niega).",
    "guide.step.owl": "📰 Llama al Periodista — Señala a un jugador para nominar en la discusión de mañana.",
    "guide.step.owlReveal": "📰 Revela la nominación del Periodista — Este jugador es automáticamente sospechoso para la votación de hoy.",
    "guide.step.mythomaniac": "🎭 Impostor — Esta noche elige a alguien para copiar. La resolución ocurre al amanecer.",
    "guide.step.possessed": "👤 Recuerda: Un Político Corrupto está ayudando secretamente a la mafia sin conocer sus identidades.",
    "guide.step.masons": "🤝 Llama a los Sindicalistas — Abren los ojos, se reconocen en silencio, luego cierran los ojos.",
    "guide.step.hamster": "🐀 Recuerda: La Rata es inmune a la mafia pero muere instantáneamente si el Detective la investiga.",
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
    "guide.step.dayDiscuss": "☀️ Día {day} Discusión — Deja que la ciudad debata, luego recoge los votos para el arresto.",
    "guide.step.dawn": "☀️ Mañana del Día {day} — Todos abren los ojos. Anuncia dramáticamente las víctimas de la mafia.",
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
        "werehamster": { "name": "Rata", "teamLabel": "Solitario", "description": "Solo quieres sobrevivir. Inmune a los ataques de la mafia pero el Detective te mata si te investiga. Ganas solo si vives hasta el final." },
        "mythomaniac": { "name": "Impostor", "teamLabel": "Ciudadanos", "description": "Al final de la segunda noche elige a un jugador: si es Mafia te conviertes en uno, si es Detective heredas su poder, de lo contrario sigues como ciudadano." }
    }
};

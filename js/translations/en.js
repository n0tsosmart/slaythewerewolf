/**
 * @fileoverview English translations for Slay the Werewolf
 * Version: 1.1.6
 */
export const en = {
    // Header Section
    "header.label": "A TRIBUTE TO LUPUS IN TABULA",
    "header.title": "Slay the Werewolf",
    "header.tagline1": "Remember to slay the wolf.",

    // Global Buttons
    "buttons.restart": "New game",
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
    "buttons.eliminate": "🐺 Maul",
    "buttons.eliminateNight": "Eliminate",
    "buttons.newMatch": "🎮 New game",
    "buttons.finalNew": "🔁 New game",
    "buttons.showSummary": "📜 View summary",
    "buttons.back": "← Back",
    "buttons.cancel": "Cancel",
    "buttons.confirm": "Confirm",
    "buttons.leave": "Leave",
    "buttons.discover": "👁️ Discover",
    "buttons.discovered": "Discovered",

    // Offline
    "offline.indicator": "📴 You are offline",
    "offline.onlineDisabled": "Online mode requires internet connection",

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
    "setup.haptics": "Vibration",

    // Balance Indicator
    "balance.wolves": "🔴 Favors Wolves",
    "balance.village": "🔵 Favors Village",
    "balance.balanced": "🟢 Balanced",

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
    "myth.result.seer": "{name} inherits the Seer's power after copying {target}.",
    "myth.result.human": "{name} stays human after copying {target}.",
    "myth.status.waiting": "Waiting",
    "myth.status.ready": "Ready",
    "myth.status.done": "Resolved",
    "myth.confirm": "Apply transformation",
    "myth.blockedButton": "Resolve the Mythomaniac",
    "myth.completeWarning": "Complete the Mythomaniac transformation before advancing to the next day.",

    // Day Cycle
    "day.label": "Day",
    "day.tooltip": "This is the current game day",
    "day.clickTooltip": "📅 Day {day} of the game",

    // Turn Timer
    "timer.warning30": "⏱️ 30 seconds left!",
    "timer.warning10": "⏱️ 10 seconds left!",
    "timer.complete": "⏰ Time is up!",
    "timer.skipped": "Timer skipped",
    "timer.pause": "Pause",
    "timer.resume": "Resume",

    // Narrator Guide
    "guide.title": "Narrator Guide",
    "guide.progress": "Step {current} of {total}",
    "guide.empty": "No instructions for this day.",
    "guide.step.closeEyes": "🌙 Night {day} begins — Ask everyone to close their eyes and remain silent.",
    "guide.step.masons": "🤝 Call the Masons — They open their eyes and silently recognize each other, then close their eyes.",
    "guide.step.bodyguard": "🛡️ Call the Bodyguard — Point to the player they wish to protect tonight, then close their eyes.",
    "guide.step.seer": "👁️ Call the Seer — Point to a player to investigate. Nod for werewolf, shake your head for human.",
    "guide.step.medium": "🔮 Call the Medium — Reveal whether yesterday's lynched player was a werewolf (nod/shake).",
    "guide.step.owl": "🦉 Call the Owl — Point to a player to nominate for tomorrow's discussion.",
    "guide.step.mythomaniac": "🎭 Mythomaniac — Tonight they choose someone to copy. Resolution happens at dawn.",
    "guide.step.wolves": "🐺 Call the Werewolves — They open their eyes, silently agree on a victim, then close their eyes.",
    "guide.step.hamster": "🐹 Remember: The Werehamster is immune to wolves but dies instantly if the Seer investigates them.",
    "guide.step.dawn": "☀️ Dawn of Day {day} — Everyone opens their eyes. Announce last night's victims dramatically.",
    "guide.step.owlReveal": "📰 Reveal the Owl's nomination — This player is automatically a suspect for today's vote.",
    "guide.step.possessed": "👤 Remember: A Possessed is secretly helping the wolves without knowing their identities.",
    "guide.step.dayDiscuss": "☀️ Day {day} Discussion — Let the village debate, then collect votes for the two suspects to stand trial.",

    // Elimination & Revive
    "elimination.title": "Eliminate a player",
    "elimination.placeholder": "Select a player",
    "elimination.none": "No living players",
    "elimination.discovered": "{name} was discovered by the Seer and died instantly",

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
    "status.ghost": "Ghost",
    "status.ghostTooltip": "Eliminated player - can vote for suspects but must stay silent",

    // Ghost/Spectator Mode
    "ghost.reminderTitle": "Ghost Rules",
    "ghost.reminderMessage": "You have been eliminated. You can still vote to choose suspects, but you cannot vote in the lynching. You must not speak during discussions and must close your eyes during the night.",
    "ghost.youWere": "You were a {role}",

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
    "confirmation.immune": "\"{player}\" is immune to Wolf attacks. Are you sure you want to eliminate them?",
    "confirmation.lynch": "Are you sure you want to lynch {player}?",
    "confirmation.handoff": "Ready to open the summary? Confirm you are the narrator and everyone else is not looking.",
    "confirmation.clearPlayers": "Clear all player names?",

    // Browser Compatibility
    "compat.title": "Browser Compatibility",
    "compat.webrtcWarning": "Online mode requires WebRTC. Use a modern browser like Chrome, Firefox, or Safari.",
    "compat.localStorageWarning": "Game progress cannot be saved. Enable cookies/storage or use a different browser.",
    "compat.oldBrowser": "Your browser may not support all features. Consider updating to the latest version.",

    // Accessibility Labels
    "accessibility.removePlayer": "Remove {name}",
    "accessibility.movePlayerUp": "Move {name} up",
    "accessibility.movePlayerDown": "Move {name} down",

    // Info & Rules
    "info.button": "📖 Immersion tips & rules",
    "info.title": "Keep the village immersive",
    "info.roleplayTitle": "Roleplay suggestions",
    "info.roleplayPlayers": "Players: stay in character, whisper suspicions, and describe gestures without meta comments such as 'I was picked third'.",
    "info.roleplayNarrator": "Narrator: paint the night with sensory details, call roles by title, and pause the story if the tension breaks so everyone refocuses.",
    "info.rulesTitle": "Rules & metagame",
    "info.rulesSummary": "No screenshots, recordings, or discussions outside the table. Eliminated players remain silent unless a power reintroduces them.",
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
    "menu.rules": "📜 Game rules",
    "rules.title": "Game Rules",
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
    "network.reconnecting": "Reconnecting to host...",
    "network.reconnectAttempt": "Reconnection attempt {attempt} of {max}...",
    "network.reconnectSuccess": "Reconnected successfully!",
    "network.reconnectFailed": "Could not reconnect. Please rejoin manually.",
    "network.connectionLost": "Connection lost. Attempting to reconnect...",
    "network.rejoinAccepted": "Welcome back, {name}!",
    "network.rejoinRejected": "Could not rejoin: {reason}",
    "network.playerNotInGame": "You are not part of this game.",
    "clientRole.connectionStatus": "Connection:",
    "clientRole.statusConnected": "Connected",
    "clientRole.statusReconnecting": "Reconnecting...",
    "clientRole.statusDisconnected": "Disconnected",

    // Menu
    "menu.install": "📱 Install App",
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

    // Tutorial
    "tutorial.title": "How to Play",
    "tutorial.skip": "Skip",
    "tutorial.prev": "← Back",
    "tutorial.next": "Next →",
    "tutorial.done": "Let's Play!",
    "tutorial.step1.title": "Welcome to Slay the Werewolf",
    "tutorial.step1.desc": "A social deduction game where villagers must find and eliminate werewolves hiding among them before it's too late.",
    "tutorial.step2.title": "Setup the game",
    "tutorial.step2.desc": "Choose the number of players (5-24), add optional special roles, and optionally enter player names for easy tracking.",
    "tutorial.step3.title": "Deal the cards",
    "tutorial.step3.desc": "Pass the device around so each player can secretly see their role. Only you know who you are!",
    "tutorial.step4.title": "Night phase",
    "tutorial.step4.desc": "Everyone closes their eyes. The narrator guides special roles to wake up and use their powers. Werewolves choose a victim.",
    "tutorial.step5.title": "Day phase",
    "tutorial.step5.desc": "Discuss and debate! The village votes to lynch a suspected werewolf. Use the voting buttons to track suspects.",
    "tutorial.step6.title": "Win the game",
    "tutorial.step6.desc": "Village wins when all werewolves are eliminated. Werewolves win when they equal the remaining villagers.",
    "menu.tutorial": "📖 How to Play",
};

/**
 * English Mafia theme overrides
 */
export const enMafia = {
    "balance.wolves": "🔴 Favors Mafia",
    "balance.village": "🔵 Favors Citizens",
    "header.tagline1": "Remember to eliminate the mafia.",
    "buttons.lynch": "⚖️ Arrest",
    "buttons.eliminate": "🔫 Shoot",
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
    "myth.result.seer": "{name} inherits the Detective's power after copying {target}.",
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
        "werehamster": { "name": "Rat", "teamLabel": "Loner", "description": "You only want to survive. Immune to mafia attacks but the Detective kills you if they investigate you. Win alone if you live to the end." },
        "mythomaniac": { "name": "Impostor", "teamLabel": "Citizens", "description": "At the end of the second night choose a player: if they are Mafia you become one, if they are the Detective you inherit the power, otherwise you remain citizen." }
    }
};

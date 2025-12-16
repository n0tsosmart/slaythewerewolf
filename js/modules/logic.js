export function normalizeMythStatus(savedStatus, players, deck) {
  if (!players.length) return null;
  if (savedStatus) {
    let index = -1;
    if (savedStatus.playerName) {
      index = players.findIndex((name) => name === savedStatus.playerName);
    }
    if (index === -1 && typeof savedStatus.playerIndex === "number") {
      index = savedStatus.playerIndex;
    }
    if (index >= 0 && index < players.length) {
      return {
        playerIndex: index,
        playerName: players[index],
        targetName: savedStatus.targetName || null,
        outcome: savedStatus.outcome || null,
        completed: Boolean(savedStatus.completed),
      };
    }
  }
  // Detect from deck if no saved status
  return detectMythStatusFromDeck(players, deck);
}

export function detectMythStatusFromDeck(players, deck) {
  if (!players.length || !deck.length) return null;
  const playerIndex = deck.findIndex((card) => card.roleId === "mythomaniac");
  if (playerIndex === -1) return null;
  return {
    playerIndex,
    playerName: players[playerIndex] || "",
    targetName: null,
    outcome: null,
    completed: false,
  };
}

export function determineMythOutcome(card) {
  if (!card) return "human";
  if (card.roleId === "seer") return "seer";
  if (card.team === "wolves") return "wolf";
  return "human";
}

export function isImmuneToWolves(card) {
  return card && card.roleId === "werehamster";
}
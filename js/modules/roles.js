import { ROLE_LIBRARY } from './config.js';

/**
 * Creates a new role card object based on a role definition from `ROLE_LIBRARY`.
 */
export function createCard(role) {
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

/**
 * Reconstructs a deck from an array of role IDs.
 */
export function deckFromRoleIds(roleIds) {
  if (!Array.isArray(roleIds)) return [];
  return roleIds.map((roleId) => createCard(ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager));
}

// ──────────────────────────────────────────
// Gestion de la mémoire des conversations
// Stockage en mémoire (remplacer par Redis/DB en production)
// ──────────────────────────────────────────

const conversations = new Map();
const MAX_HISTORY = 20; // nb de messages conservés par utilisateur

/**
 * Ajoute un message à l'historique d'un utilisateur
 * @param {string} userId - numéro WhatsApp
 * @param {"user"|"assistant"} role
 * @param {string} content
 */
function addMessage(userId, role, content) {
  if (!conversations.has(userId)) {
    conversations.set(userId, []);
  }
  const history = conversations.get(userId);
  history.push({ role, content });

  // Garder seulement les N derniers messages
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
}

/**
 * Récupère l'historique complet d'un utilisateur
 * @param {string} userId
 * @returns {Array<{role: string, content: string}>}
 */
function getHistory(userId) {
  return conversations.get(userId) || [];
}

/**
 * Réinitialise la conversation d'un utilisateur
 * @param {string} userId
 */
function clearHistory(userId) {
  conversations.delete(userId);
}

module.exports = { addMessage, getHistory, clearHistory };

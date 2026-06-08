const Anthropic = require("@anthropic-ai/sdk");
const { sendWhatsAppMessage } = require("./whatsapp");
const { addMessage, getHistory, clearHistory } = require("./memory");
const { SYSTEM_PROMPT } = require("../config/prompt");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Traite un message entrant et envoie une réponse via WhatsApp
 * @param {string} userId - numéro de l'expéditeur
 * @param {string} userMessage - texte reçu
 */
async function handleIncomingMessage(userId, userMessage) {
  // Commande de réinitialisation
  if (userMessage.toLowerCase() === "reset") {
    clearHistory(userId);
    await sendWhatsAppMessage(
      userId,
      "🔄 Conversation réinitialisée. Comment puis-je vous aider ?"
    );
    return;
  }

  // Ajout du message utilisateur à l'historique
  addMessage(userId, "user", userMessage);
  const history = getHistory(userId);

  try {
    // Appel à l'API Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const assistantReply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Sauvegarde de la réponse dans l'historique
    addMessage(userId, "assistant", assistantReply);

    // Envoi de la réponse WhatsApp
    await sendWhatsAppMessage(userId, assistantReply);

    console.log(`✅ Réponse envoyée à ${userId}`);
  } catch (err) {
    console.error("Erreur API Claude:", err);
    await sendWhatsAppMessage(
      userId,
      "Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants."
    );
  }
}

module.exports = { handleIncomingMessage };

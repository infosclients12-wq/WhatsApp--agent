const Groq = require("groq-sdk");
const { sendWhatsAppMessage } = require("./whatsapp");
const { addMessage, getHistory, clearHistory } = require("./memory");
const { SYSTEM_PROMPT } = require("../config/prompt");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function handleIncomingMessage(userId, userMessage) {
  if (userMessage.toLowerCase() === "reset") {
    clearHistory(userId);
    await sendWhatsAppMessage(
      userId,
      "🔄 Conversation réinitialisée. Comment puis-je vous aider ?"
    );
    return;
  }

  addMessage(userId, "user", userMessage);
  const history = getHistory(userId);

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
      ],
    });

    const assistantReply = response.choices[0].message.content;

    addMessage(userId, "assistant", assistantReply);
    await sendWhatsAppMessage(userId, assistantReply);

    console.log(`✅ Réponse envoyée à ${userId}`);
  } catch (err) {
    console.error("Erreur API Groq:", err);
    await sendWhatsAppMessage(
      userId,
      "Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants."
    );
  }
}

module.exports = { handleIncomingMessage };

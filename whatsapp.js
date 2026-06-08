const axios = require("axios");

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

/**
 * Envoie un message texte via l'API WhatsApp Business
 * @param {string} to - numéro destinataire (format international, ex: 33612345678)
 * @param {string} text - contenu du message
 */
async function sendWhatsAppMessage(to, text) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    const error = err.response?.data || err.message;
    console.error("Erreur envoi WhatsApp:", JSON.stringify(error, null, 2));
    throw err;
  }
}

module.exports = { sendWhatsAppMessage };

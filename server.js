require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./agent");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// ──────────────────────────────────────────
// Vérification du webhook (Meta exige cela)
// ──────────────────────────────────────────
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook vérifié avec succès");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Token de vérification invalide");
    res.sendStatus(403);
  }
});

// ──────────────────────────────────────────
// Réception des messages WhatsApp entrants
// ──────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object !== "whatsapp_business_account") {
    return res.sendStatus(404);
  }

  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return res.sendStatus(200); // notification non-message (statut, etc.)
    }

    const message = messages[0];
    const from = message.from; // numéro de l'expéditeur
    const text = message.text?.body;

    if (!text) {
      console.log("Message non-textuel ignoré (image, audio, etc.)");
      return res.sendStatus(200);
    }

    console.log(`📩 Message reçu de ${from}: ${text}`);

    // Traitement asynchrone (on répond 200 tout de suite à Meta)
    handleIncomingMessage(from, text).catch(console.error);

    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur lors du traitement du webhook:", err);
    res.sendStatus(500);
  }
});

// ──────────────────────────────────────────
// Démarrage du serveur
// ──────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

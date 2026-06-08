# 🤖 Agent IA WhatsApp E-commerce

Agent conversationnel intelligent pour WhatsApp Business, propulsé par Claude (Anthropic).

---

## 🚀 Installation

### 1. Prérequis
- Node.js 18+
- Un compte [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started) (Meta)
- Une clé API [Anthropic](https://console.anthropic.com/)
- Un serveur accessible publiquement (ou [ngrok](https://ngrok.com/) pour les tests)

### 2. Cloner et installer
```bash
git clone <ton-repo>
cd whatsapp-agent
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Édite `.env` et remplis toutes les valeurs :

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Clé API depuis console.anthropic.com |
| `WHATSAPP_ACCESS_TOKEN` | Token d'accès depuis Meta for Developers |
| `WHATSAPP_PHONE_NUMBER_ID` | ID de ton numéro WhatsApp Business |
| `WHATSAPP_VERIFY_TOKEN` | Token secret de ton choix (ex: `mon_secret_123`) |

### 4. Personnaliser l'agent
Édite `config/prompt.js` pour :
- Renseigner le **nom de ta boutique**
- Ajouter ton **catalogue produits** (prix, descriptions)
- Mettre à jour les **informations de livraison et retours**

---

## ▶️ Lancement

```bash
# Production
npm start

# Développement (avec rechargement auto)
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

---

## 🔗 Configuration du Webhook Meta

### Option A — Test local avec ngrok
```bash
ngrok http 3000
```
Copie l'URL HTTPS fournie (ex: `https://abc123.ngrok.io`)

### Option B — Serveur de production
Utilise l'URL publique de ton serveur.

### Dans Meta for Developers :
1. Va sur [developers.facebook.com](https://developers.facebook.com)
2. Ouvre ton app → **WhatsApp → Configuration**
3. Dans "Webhooks", clique **Modifier**
4. URL de rappel : `https://TON_URL/webhook`
5. Token de vérification : la valeur de `WHATSAPP_VERIFY_TOKEN` dans ton `.env`
6. Coche **messages** dans les champs d'abonnement
7. Clique **Vérifier et enregistrer**

---

## 💬 Fonctionnalités

- ✅ Réponses intelligentes basées sur ton catalogue
- ✅ Mémoire de conversation (contexte conservé par utilisateur)
- ✅ Gestion de la langue automatique
- ✅ Commande `reset` pour réinitialiser une conversation
- ✅ Gestion d'erreurs robuste

---

## 🏗️ Structure du projet

```
whatsapp-agent/
├── src/
│   ├── server.js      # Serveur Express + webhook
│   ├── agent.js       # Logique de l'agent IA (Claude)
│   ├── whatsapp.js    # Envoi de messages WhatsApp
│   └── memory.js      # Gestion de la mémoire des conversations
├── config/
│   └── prompt.js      # Prompt système (personnalise ici !)
├── .env.example       # Template des variables d'environnement
├── package.json
└── README.md
```

---

## 🔒 Sécurité

- Ne committe **jamais** ton fichier `.env`
- Ajoute `.env` à ton `.gitignore`
- En production, utilise un gestionnaire de secrets (ex: AWS Secrets Manager, Railway)

---

## 📦 Déploiement recommandé

| Plateforme | Commande / Notes |
|---|---|
| [Railway](https://railway.app) | Connecte ton repo GitHub, ajoute les variables d'env |
| [Render](https://render.com) | Web Service → Node → variables d'env dans le dashboard |
| [Heroku](https://heroku.com) | `heroku create && git push heroku main` |
| VPS (Ubuntu) | `pm2 start src/server.js` |

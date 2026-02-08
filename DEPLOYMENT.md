# BJJ Progress Tracker - Guide de Déploiement 🥋

Application de suivi de progression en Brazilian Jiu-Jitsu déployée sur le cloud gratuitement.

## 📋 Architecture

- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB → MongoDB Atlas

## 🚀 Déploiement Étape par Étape

### 1. MongoDB Atlas (Base de Données)

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créer un nouveau cluster (sélectionner **FREE** plan M0)
3. Créer un utilisateur database:
   - Database Access → Add New Database User
   - Choisir un nom d'utilisateur et un mot de passe sécurisé
4. Configurer Network Access:
   - Network Access → Add IP Address
   - Autoriser **0.0.0.0/0** (Allow access from anywhere)
5. Obtenir la connection string:
   - Clusters → Connect → Connect your application
   - Copier la connection string
   - Remplacer `<password>` par votre mot de passe

**Connection String Format:**
\`\`\`
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/bjj-tracker?retryWrites=true&w=majority
\`\`\`

### 2. GitHub (Contrôle de Version)

1. Créer un compte sur [GitHub](https://github.com/signup)
2. Créer un nouveau repository (public ou privé)
3. Dans votre terminal local:

\`\`\`bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: BJJ Tracker App"

# Ajouter le remote
git remote add origin https://github.com/votre-username/votre-repo.git

# Pousser vers GitHub
git branch -M main
git push -u origin main
\`\`\`

### 3. Render (Backend API)

1. Créer un compte sur [Render](https://render.com/register)
2. Dashboard → New → Web Service
3. Connecter votre repository GitHub
4. Configuration:
   - **Name**: `bjj-tracker-api` (ou votre choix)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Environment Variables (cliquer sur "Advanced"):
   - `MONGODB_URI`: votre connection string MongoDB Atlas
   - `JWT_SECRET`: générer avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NODE_ENV`: `production`

6. Créer le Web Service → Attendre le déploiement (~2-3 minutes)
7. **Noter l'URL**: `https://bjj-tracker-api.onrender.com`

### 4. Vercel (Frontend)

1. Créer un compte sur [Vercel](https://vercel.com/signup)
2. Dashboard → Add New → Project
3. Importer votre repository GitHub
4. Configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Environment Variables:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://bjj-tracker-api.onrender.com/api` (remplacer par votre URL Render)

6. Deploy → Attendre le déploiement (~1-2 minutes)
7. **Votre app est en ligne!** 🎉

## 🧪 Tests

### Tester le Backend
1. Ouvrir `https://votre-backend.onrender.com/`
2. Vous devriez voir: `{"message":"🥋 BJJ Tracker API is running..."}`

### Tester le Frontend
1. Ouvrir votre URL Vercel
2. S'inscrire avec un nouveau compte
3. Se connecter
4. Créer un entraînement
5. Vérifier les statistiques

### Vérifier MongoDB
1. MongoDB Atlas → Browse Collections
2. Vérifier que les données (users, trainings) apparaissent

## 🔧 Configuration Locale

### Backend
1. Copier `backend/.env.example` vers `backend/.env`
2. Remplir les variables:
\`\`\`env
PORT=5000
MONGODB_URI=votre_connection_string_mongodb
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
\`\`\`

### Frontend
Le fichier `.env.development` est déjà configuré pour pointer vers `http://localhost:5000/api`

### Lancer en local
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
\`\`\`

## 📝 Notes Importantes

- **Render Free Plan**: Le backend peut ralentir après 15min d'inactivité (redémarre automatiquement)
- **MongoDB Atlas Free**: Limite à 512MB de données
- **Vercel Free**: Limite de 100GB de bande passante/mois

## 🔒 Sécurité

- ✅ Ne jamais committer le fichier `.env`
- ✅ Utiliser des secrets JWT complexes
- ✅ Mettre à jour régulièrement les dépendances
- ✅ Configurer CORS correctement

## 📚 Resources

- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Développé avec ❤️ pour la communauté BJJ**

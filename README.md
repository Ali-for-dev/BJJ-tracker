# BJJ Progress Tracker 🥋

Application web et mobile complète pour suivre votre progression en jiu-jitsu brésilien.

## 🚀 Fonctionnalités

- ✅ **Authentification** - Inscription et connexion sécurisées
- ✅ **Tableau de bord** - Vue d'ensemble de vos statistiques
- ✅ **Journal d'entraînement** - Enregistrez toutes vos séances
- 🚧 **Bibliothèque de techniques** - Organisez vos techniques (en développement)
- 🚧 **Statistiques de progression** - Graphiques et analyses (en développement)
- 🚧 **Gestion des compétitions** - Planifiez et suivez vos compétitions (en développement)
- ✅ **Profil utilisateur** - Gérez vos informations et objectifs

## 📦 Stack Technique

### Backend
- **Node.js** + **Express**
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe

### Frontend
- **React** 18 avec **Vite**
- **React Router** pour la navigation
- **Lenis.js** pour le smooth scrolling
- **Axios** pour les requêtes API
- **Lucide React** pour les icônes
- Design system custom avec CSS variables

### Mobile
- **Capacitor.js** pour iOS/Android

## 🛠️ Installation

### Prérequis
- Node.js 18+ et npm
- MongoDB installé et en cours d'exécution
- (Optionnel) Android Studio ou Xcode pour le build mobile

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:3000`

## 📱 Build Mobile (Optionnel)

### Installation de Capacitor

```bash
cd frontend
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

### Build web

```bash
npm run build
```

### Ajouter les plateformes

```bash
npx cap add android
npx cap add ios
```

### Synchroniser

```bash
npx cap sync
```

### Ouvrir dans l'IDE natif

```bash
# Pour Android
npx cap open android

# Pour iOS (Mac seulement)
npx cap open ios
```

## 🎨 Design

L'application utilise un design moderne avec:
- Thème clair/sombre
- Glassmorphism effects
- Animations fluides
- Design responsive (mobile, tablet, desktop)
- Couleurs des ceintures BJJ intégrées

## 📖 Utilisation

1. **Créez un compte** avec votre email
2. **Configurez votre profil** (ceinture, académie, objectifs)
3. **Enregistrez vos séances** d'entraînement
4. **Suivez vos statistiques** sur le dashboard
5. **Gérez vos objectifs** à court et long terme

## 🔑 Variables d'environnement

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bjj-tracker
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Users
- `GET /api/users/profile` - Obtenir le profil
- `PUT /api/users/profile` - Mettre à jour le profil

### Trainings
- `GET /api/trainings` - Liste des séances
- `POST /api/trainings` - Créer une séance
- `GET /api/trainings/stats` - Statistiques
- `PUT /api/trainings/:id` - Mettre à jour
- `DELETE /api/trainings/:id` - Supprimer

### Techniques
- `GET /api/techniques` - Liste des techniques
- `POST /api/techniques` - Ajouter une technique
- `PUT /api/techniques/:id` - Mettre à jour
- `DELETE /api/techniques/:id` - Supprimer

### Competitions
- `GET /api/competitions` - Liste des compétitions
- `POST /api/competitions` - Ajouter une compétition
- `PUT /api/competitions/:id` - Mettre à jour
- `DELETE /api/competitions/:id` - Supprimer

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 👨‍💻 Auteur

Créé avec ❤️ pour la communauté BJJ

---

**Bon entraînement ! Oss! 🥋**

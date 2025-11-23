# 👤 Comment Créer un Utilisateur depuis Render

## Option 1: Utiliser l'Endpoint API (RECOMMANDÉ - Gratuit)

C'est la méthode la plus simple et elle ne nécessite pas d'accès payant au shell.

### Créer un Utilisateur Admin

Visitez simplement cette URL dans votre navigateur :

```
https://opendev.onrender.com/api/seed?secret=seed-2024
```

Cet endpoint va :
- ✅ Créer/mettre à jour l'utilisateur admin
- ✅ Définir le mot de passe à "admin123"
- ✅ Configurer tous les paramètres correctement

### Créer un Utilisateur Personnalisé

Si vous voulez créer un utilisateur avec un email/mot de passe différent, vous pouvez modifier l'endpoint ou créer un nouvel endpoint.

---

## Option 2: Utiliser Render Shell (Payant)

Si vous avez accès au shell Render (plan payant) :

### Étape 1: Accéder au Shell

1. Allez sur **Render Dashboard** → Votre service
2. Cliquez sur l'onglet **"Shell"**
3. Si vous ne voyez pas cet onglet, c'est que le shell n'est pas disponible sur votre plan

### Étape 2: Exécuter le Script

Dans le shell, exécutez :

```bash
npm run create-admin
```

Ou pour créer l'utilisateur avec toutes les données de seed :

```bash
npm run seed
```

### Étape 3: Créer un Utilisateur Personnalisé

Vous pouvez aussi créer un script personnalisé. Créez un fichier `create-user.js` :

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const email = 'votre-email@example.com';
const password = 'votre-mot-de-passe';
const name = 'Votre Nom';

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: 'user' },
      isBanned: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    }));

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin', // ou 'user'
      isBanned: false,
      isVerified: true
    });

    console.log('✅ User created:', user.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createUser();
```

Puis exécutez :
```bash
node create-user.js
```

---

## Option 3: Utiliser l'Endpoint API de Création d'Utilisateur (RECOMMANDÉ)

J'ai créé un endpoint spécialement pour créer des utilisateurs personnalisés !

### Créer un Utilisateur Admin

Visitez cette URL (remplacez les valeurs) :

```
https://opendev.onrender.com/api/create-user?email=admin@opendev.com&password=admin123&name=Admin%20User&role=admin&secret=create-user-2024
```

### Créer un Utilisateur Normal

```
https://opendev.onrender.com/api/create-user?email=user@example.com&password=password123&name=John%20Doe&role=user&secret=create-user-2024
```

**Paramètres :**
- `email` : Email de l'utilisateur (requis)
- `password` : Mot de passe (requis, minimum 6 caractères)
- `name` : Nom de l'utilisateur (requis)
- `role` : `admin` ou `user` (optionnel, défaut: `user`)
- `secret` : Secret pour la sécurité (requis: `create-user-2024`)

**Exemple complet :**
```
https://opendev.onrender.com/api/create-user?email=john@example.com&password=mypassword123&name=John%20Smith&role=admin&secret=create-user-2024
```

**Note :** Les espaces dans le nom doivent être encodés en `%20` (ex: "John Smith" → "John%20Smith")

---

## Option 4: Depuis MongoDB Atlas (Direct)

### Étape 1: Accéder à MongoDB Atlas

1. Allez sur **https://cloud.mongodb.com**
2. Connectez-vous
3. Sélectionnez votre cluster

### Étape 2: Ouvrir la Collection Users

1. Cliquez sur **"Browse Collections"**
2. Sélectionnez la base de données : `opendev`
3. Sélectionnez la collection : `users`

### Étape 3: Générer le Hash du Mot de Passe

Sur votre machine locale, exécutez :

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-mot-de-passe', 10).then(h => console.log(h));"
```

Cela affichera un hash comme :
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
```

### Étape 4: Insérer le Document

Dans MongoDB Atlas, cliquez **"Insert Document"** et collez :

```json
{
  "name": "Votre Nom",
  "email": "votre-email@example.com",
  "password": "$2a$10$VOTRE_HASH_GENERE_CI_DESSUS",
  "role": "admin",
  "isBanned": false,
  "isVerified": true,
  "createdAt": {
    "$date": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Résumé des Options

| Méthode | Coût | Difficulté | Recommandé |
|---------|------|------------|------------|
| Endpoint API `/api/seed` | Gratuit | ⭐ Facile | ✅ Oui |
| Render Shell | Payant | ⭐⭐ Moyen | Si disponible |
| MongoDB Atlas | Gratuit | ⭐⭐⭐ Difficile | Si besoin personnalisé |
| Endpoint personnalisé | Gratuit | ⭐ Facile | Si besoin fréquent |

---

## Solution Rapide (Maintenant)

Pour créer l'utilisateur admin maintenant, visitez simplement :

```
https://opendev.onrender.com/api/seed?secret=seed-2024
```

C'est tout ! 🎉


# 🔧 CORRIGER LE MOT DE PASSE MAINTENANT

## Le Problème

Votre utilisateur existe dans MongoDB mais le hash du mot de passe ne correspond pas à "admin123".

**Hash actuel dans MongoDB :**
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

Ce hash ne correspond **PAS** au mot de passe "admin123".

## Solution : Utiliser l'Endpoint de Correction

### Étape 1 : Visitez cette URL

Ouvrez cette URL dans votre navigateur (après que Render ait redéployé) :

```
https://opendev.onrender.com/api/fix-admin-password?secret=fix-admin-2024
```

### Étape 2 : Vérifiez la Réponse

Vous devriez voir une réponse JSON comme :

```json
{
  "success": true,
  "message": "Admin password fixed successfully!",
  "action": "updated",
  "details": {
    "email": "admin@opendev.com",
    "role": "admin",
    "isVerified": true,
    "isBanned": false,
    "passwordTest": "✅ VALID"
  }
}
```

### Étape 3 : Connectez-vous

Maintenant, essayez de vous connecter :
- **URL** : https://opendev.onrender.com/login
- **Email** : `admin@opendev.com`
- **Password** : `admin123`

Les logs devraient maintenant afficher :
```
🔑 [AUTH] Password comparison result: ✅ VALID
✅ [AUTH] Authentication successful!
```

---

## Alternative : Utiliser l'Endpoint Seed

Si l'endpoint fix-admin-password ne fonctionne pas, utilisez :

```
https://opendev.onrender.com/api/seed?secret=seed-2024
```

Cet endpoint fait la même chose mais crée aussi les données de seed.

---

## Vérification dans MongoDB Atlas

Après avoir utilisé l'endpoint, le hash dans MongoDB devrait changer. Le nouveau hash sera différent de :
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

Le nouveau hash correspondra correctement à "admin123".

---

## Si ça ne fonctionne toujours pas

1. Vérifiez les logs Render pour voir les messages de l'endpoint
2. Assurez-vous que l'endpoint a bien été déployé
3. Vérifiez que vous utilisez le bon secret : `fix-admin-2024`

---

**ACTION IMMÉDIATE :** Visitez cette URL maintenant :
```
https://opendev.onrender.com/api/fix-admin-password?secret=fix-admin-2024
```


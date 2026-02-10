# Configuration API Adzuna

## 🚀 Pour passer en mode production (API réelle)

### 1. Obtenir vos clés API Adzuna

1. Créez un compte sur [Adzuna](https://developer.adzuna.com/)
2. Obtenez votre `APP_ID` et `APP_KEY`
3. Copiez vos clés

### 2. Configurer les clés dans le projet

Modifiez le fichier `src/app/core/config/api.config.ts` :

```typescript
export const API_CONFIG = {
  ADZUNA: {
    BASE_URL: 'https://api.adzuna.com/v1/api',
    APP_ID: 'VOTRE_VRAI_APP_ID',     // Remplacez ici
    APP_KEY: 'VOTRE_VRAI_APP_KEY',   // Remplacez ici
    COUNTRY_CODE: 'fr'               // France par défaut
  }
};
```

### 3. Activer le mode production

Dans `src/app/core/services/job.service.ts`, changez la ligne 64 :

```typescript
private isDevelopment(): boolean {
  return false; // Changez à false pour utiliser l'API Adzuna
}
```

### 4. Tester l'API

Lancez l'application et testez la recherche. Vous devriez voir dans la console :
- `API Interceptor: Adding Adzuna credentials to request`
- Les vraies données de l'API Adzuna

## 🔧 Fonctionnalités implémentées

### ✅ Gestion des erreurs HTTP
- 401: Clé API invalide
- 403: Accès non autorisé  
- 404: Ressource non trouvée
- 429: Trop de requêtes
- 500: Erreur serveur

### ✅ Intercepteur HTTP
- Ajout automatique des clés API
- Log des requêtes/réponses
- Gestion centralisée des erreurs

### ✅ Fallback automatique
- En cas d'erreur API, retourne les données mockées
- Garantit que l'application fonctionne toujours

## 📊 Sources de données

### Mode Développement (actuel)
- **Source**: Données mockées dans `job.service.ts`
- **Avantages**: Pas besoin de clé API, fonctionne hors ligne
- **Inconvénients**: Données limitées et statiques

### Mode Production (configuré)
- **Source**: API Adzuna réelle
- **Avantages**: Données réelles et fraîches
- **Inconvénients**: Nécessite clé API, dépend d'Internet

## 🎯 Exigences respectées

- ✅ **Recherche par titre uniquement**: Filtre implémenté
- ✅ **Tri par date**: Plus récent en premier
- ✅ **Pagination**: 10 résultats par page
- ✅ **Gestion d'erreurs**: Messages utilisateurs clairs
- ✅ **Fallback**: Sécurité en cas d'échec API

## 🔍 Monitoring

Les logs dans la console vous permettront de suivre :
- Les requêtes API envoyées
- Les réponses reçues
- Les erreurs éventuelles
- Les bascules vers les données mockées

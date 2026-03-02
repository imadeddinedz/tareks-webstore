# High Tech Sport — E-Commerce Premium (Algérie)

Plateforme e-commerce moderne, rapide et optimisée pour High Tech Sport (Khemis Miliana), conçue spécifiquement pour le marché algérien (Paiement à la livraison, 58 wilayas, mobile-first).

## Technologies Utilisées

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend & BDD:** Supabase (PostgreSQL)
- **Gestion d'état:** Zustand (Panier persistant)
- **Design:** Theme "Nano Banana 2", Glassmorphism, animations fluides
- **Icons & UI:** Lucide React, React Hot Toast

## Fonctionnalités Clés

### Boutique (Storefront)
- 🛒 **Panier intelligent** avec gestion des quantités et persistance
- 🇩🇿 **Checkout localisé** avec validation stricte des numéros de téléphone algériens (05/06/07)
- 🚚 **Livraison 58 Wilayas** avec calcul dynamique des frais
- 💰 **Paiement à la livraison (COD)** unique méthode de paiement (adapté au marché local)
- 📦 **Suivi de commande** via numéro de téléphone ou ID de commande
- 📱 **Mobile-First** avec navigation inférieure et bouton WhatsApp flottant
- 🎨 **Mode Sombre/Clair** persistant

### Administration (Dashboard)
Interface complète accessible via `/admin` (sécurisée par mot de passe).
- 📊 **Tableau de bord** avec statistiques de ventes et alertes de stock
- 📦 **Gestion des produits** (CRUD)
- 🛒 **Gestion des commandes** avec progression du statut (Nouvelle -> En préparation -> Expédiée -> Livrée)
- 👥 **Gestion des clients** avec système de "Liste noire"
- 🚚 **Gestion des tarifs de livraison** modifiables pour les 58 wilayas
- 🏷️ **Gestion des codes promotionnels**

## Configuration Rapide

1. Cloner le projet et installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement (`.env.local`) :
```env
NEXT_PUBLIC_SUPABASE_URL="votre-url-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-anon"
SUPABASE_SERVICE_ROLE_KEY="votre-cle-service-role"
ADMIN_PASSWORD="votre-mot-de-passe"
```

3. Initialiser la base de données :
Exécuter le script SQL situé dans `../supabase-schema.sql` dans votre projet Supabase.

4. Lancer le serveur de développement :
```bash
npm run dev
```

## Déploiement

Ce projet est optimisé pour être déployé sur **Vercel** ou tout serveur Node.js moderne supportant Next.js.
```bash
npm run build
npm run start
```

## Droits d'auteur
Développé exclusivement pour High Tech Sport. Tous droits réservés.

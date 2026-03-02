# High Tech Sport – Site Web

Site e-commerce pour High Tech Sport (Khemis Miliana). Catalogue produits, contact WhatsApp/téléphone, paiement à la livraison.

## Stack

- **Frontend** : Next.js 16, React, Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Storage)
- **Hébergement** : Vercel (gratuit)

## Démarrage rapide

### 1. Installer et lancer (sans Supabase)

```bash
cd web
cp .env.example .env.local
# Éditer .env.local : ajouter ADMIN_PASSWORD=xxx
npm run dev
```

Le site fonctionne avec des produits d'exemple. Ouvrir http://localhost:3000

### 2. Configurer Supabase (pour gérer les produits)

1. Créer un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Aller dans **SQL Editor** et exécuter le contenu de `supabase-schema.sql`
3. Copier l’URL du projet et les clés (anon + service_role) depuis **Settings > API**
4. Mettre à jour `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

5. Redémarrer `npm run dev`

### 3. Admin

- URL : `/admin`
- Connexion : mot de passe défini dans `ADMIN_PASSWORD`
- Ajout / modification / suppression de produits

## Déploiement (Vercel)

1. Pousser le code sur GitHub
2. Importer le projet dans Vercel
3. Ajouter les variables d’environnement (Supabase + ADMIN_PASSWORD)
4. Déployer

## Structure

```
hightechsport/
├── web/                 # Next.js
├── supabase-schema.sql  # Schéma DB
└── README.md
```

## Contact

- Téléphone : +213 558 86 65 30
- WhatsApp : idem
- Email : tarek.0072@hotmail.fr

# Déploiement de Qui S'y Gratte

Guide pour mettre le projet en ligne sur **Vercel** avec un domaine
PlanetHoster, en utilisant **Neon** (Postgres) et **Vercel Blob** (uploads).

## Prérequis

- Un compte **GitHub** (gratuit) pour héberger le code
- Un compte **Vercel** (gratuit, login GitHub)
- Un compte **Neon** (gratuit) pour Postgres
- Un compte **Resend** (gratuit) pour les emails — déjà créé si tu suis depuis le début
- L'accès au panel DNS de **PlanetHoster** (pour pointer le domaine vers Vercel)

---

## 1. Pousser le code sur GitHub

Le projet est déjà un repo git. Il faut :

```bash
# Si pas encore configuré
git config user.name "Ton Nom"
git config user.email "ton@email.com"

# Stage + commit l'état actuel (énorme, on part de master)
git add -A
git commit -m "Qui S'y Gratte — version Next.js initiale"
```

Crée un repo vide sur GitHub (sans README pour éviter conflits), puis :

```bash
git remote add origin git@github.com:TON-USER/quisygratte.git
git branch -M main
git push -u origin main
```

---

## 2. Créer la base Postgres sur Neon

1. Va sur https://neon.tech et crée un compte (sign in with GitHub)
2. Crée un nouveau projet :
   - Nom : `quisygratte`
   - Region : Europe (Frankfurt si possible, le plus proche)
   - Postgres version : la dernière
3. Une fois créé, Neon te donne deux connection strings :
   - **Pooled connection** → c'est ton `DATABASE_URL`
   - **Direct connection** → c'est ton `DIRECT_URL`

Garde-les sous la main, on les colle dans Vercel à l'étape 4.

---

## 3. Créer le store Vercel Blob

(Tu peux faire ça après avoir importé le projet dans Vercel à l'étape 4 — c'est
plus simple parce que Vercel injecte le token automatiquement.)

Dans le dashboard Vercel de ton projet :
1. Onglet **Storage** → **Create Database** → **Blob**
2. Nom : `quisygratte-uploads`
3. Région : même que ton projet (Frankfurt si Europe)
4. Vercel injecte automatiquement `BLOB_READ_WRITE_TOKEN` dans les env vars du projet.

---

## 4. Importer le projet dans Vercel

1. Va sur https://vercel.com → **New Project**
2. **Import Git Repository** → choisis ton repo `quisygratte`
3. Framework : **Next.js** (auto-détecté)
4. **Environment Variables** — colle les valeurs :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL pooled de Neon (étape 2) |
| `DIRECT_URL` | URL direct de Neon (étape 2) |
| `RESEND_API_KEY` | Ta clé Resend |
| `EMAIL_FROM` | `Qui S'y Gratte <bonjour@ton-domaine.fr>` (ou `onboarding@resend.dev` au début) |
| `NEXT_PUBLIC_SITE_URL` | `https://ton-domaine.fr` (à changer après l'étape 6) |

`BLOB_READ_WRITE_TOKEN` sera injecté automatiquement après l'étape 3.

5. Clique **Deploy**. Vercel build et déploie.

⚠️ **Le premier deploy va échouer** parce que la DB n'a pas encore son schéma.
On le fait à l'étape suivante.

---

## 5. Lancer la migration initiale

Dans Vercel → ton projet → onglet **Settings** → **Functions** → ou directement
en local pointant sur la DB Neon :

```bash
# .env.local (sur ta machine, pas commit)
DATABASE_URL="postgresql://...neon-pooled..."
DIRECT_URL="postgresql://...neon-direct..."

# Crée la migration initiale et l'applique
npx prisma migrate dev --name init

# Seed la carte demo (optionnel, juste pour vérifier que ça tourne)
npm run db:seed
```

Si tu préfères ne pas exposer ta DB depuis ton local, alternative : ajouter
un script `postinstall` dans `package.json` qui exécute `prisma migrate deploy`
au build Vercel — moins courant, à voir si besoin.

Une fois la migration appliquée, **redeploie** depuis Vercel (bouton "Redeploy"
sur le dernier deployment). Le site doit maintenant répondre sur l'URL Vercel
(genre `quisygratte-xyz.vercel.app`).

---

## 6. Brancher ton domaine PlanetHoster

Tu as deux options selon où tu veux que les DNS soient gérés :

### Option A — Garder les DNS chez PlanetHoster (recommandé)

1. Dans Vercel → ton projet → **Settings** → **Domains**
2. Ajoute `quisygratte.fr` (ou ton domaine)
3. Vercel te demande de créer **un record A** et **un record CNAME** :

   ```
   Type   Nom    Valeur
   A      @      76.76.21.21
   CNAME  www    cname.vercel-dns.com
   ```

4. Va sur ton panel **PlanetHoster** → **DNS** de ton domaine :
   - Si tu as déjà des records A ou CNAME pour ton domaine, **supprime-les**
   - Ajoute les deux records ci-dessus
5. Sauvegarde. Propagation DNS : 5 min à 24 h (souvent < 1 h).
6. Vercel détecte automatiquement la propagation et émet un certificat SSL
   gratuit (Let's Encrypt) en 1-2 min.

### Option B — Déléguer les DNS à Vercel

Plus simple à gérer dans Vercel mais tu perds le contrôle PlanetHoster sur
le DNS. À envisager si tu as déjà tout sur Vercel.

Vercel te donne 4 nameservers (genre `ns1.vercel-dns.com`). Tu les colles
dans PlanetHoster comme nameservers du domaine.

---

## 7. Mettre à jour `NEXT_PUBLIC_SITE_URL`

Une fois le domaine branché :
1. Vercel → **Settings** → **Environment Variables**
2. Édite `NEXT_PUBLIC_SITE_URL` → `https://quisygratte.fr`
3. **Redeploy** pour que la valeur soit picked up

---

## 8. Vérifier que tout marche

- https://quisygratte.fr → homepage
- https://quisygratte.fr/creer → formulaire, upload une vraie image, submit
- Tu reçois l'email (si Resend configuré)
- Le lien `/g/CODE` rend l'image hébergée sur Vercel Blob
- Tu grattes, l'annonce apparaît, le CTA viral pointe vers `/creer`

---

## Coûts à anticiper

À ce niveau d'usage (MVP, quelques centaines de cartes / mois), **tout est
gratuit** :

| Service | Free tier | Si ça décolle |
|---|---|---|
| Vercel | 100 Go bande passante / mois | Pro à 20 €/mois (1 To) |
| Neon | 0,5 Go stockage, 190h compute / mois | 19 $/mois (10 Go, illimité) |
| Vercel Blob | 1 Go stockage | 0,15 $/Go au-delà |
| Resend | 3 000 emails / mois, 100 / jour | 20 $/mois (50 k mails) |

PlanetHoster reste utile uniquement comme registrar du domaine (~10 €/an).

---

## Workflow dev / prod après le setup

À partir de maintenant :

```bash
# Dev local
npm run dev                       # http://localhost:3000

# Pousser une modif en prod
git add .
git commit -m "ma modif"
git push                          # Vercel déclenche automatiquement le deploy
```

Vercel build, lance les migrations Prisma au passage (si configuré), et
déploie. Préviewer chaque branch est automatique (Vercel crée une URL
preview unique par PR).

---

## Quand tu voudras ajouter Stripe (étape suivante)

1. Compte Stripe → récupère `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Setup webhook → `https://quisygratte.fr/api/webhooks/stripe` → `STRIPE_WEBHOOK_SECRET`
3. Ajoute les 3 vars dans Vercel → Redeploy

Le code pour le checkout + webhook viendra en next step si tu veux.

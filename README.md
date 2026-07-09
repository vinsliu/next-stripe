# Comment lancer et tester ce projet

Ce guide explique, étape par étape, comment faire fonctionner l'application sur ton ordinateur. Suis les étapes **dans l'ordre**, sans en sauter une.

L'application permet de :
- créer un compte et se connecter,
- acheter un produit une seule fois (boutique),
- s'abonner à un espace Premium (abonnement mensuel).

Tous les paiements se font en **mode test** de Stripe : aucune carte réelle n'est débitée.

---

## Étape 1 — Installer les outils nécessaires

Il faut avoir **Node.js** installé sur l'ordinateur (version 18 ou plus récente).

Pour vérifier, ouvre un terminal et tape :

```bash
node -v
```

Si un numéro de version s'affiche (par exemple `v20.11.0`), c'est bon, tu peux passer à l'étape suivante.

---

## Étape 2 — Ouvrir le projet dans le terminal

Ouvre un terminal et place-toi dans le dossier du projet. Exemple :

```bash
cd chemin/vers/next-stripe
```

---

## Étape 3 — Installer les dépendances du projet

Copie-colle cette commande dans le terminal, puis appuie sur Entrée :

```bash
npm install
```

Attends que ça se termine (ça peut prendre une ou deux minutes).

---

## Étape 4 — Configurer le fichier `.env`

À la racine du projet, il y a un fichier nommé **`.env.example`**. Il suffit de **retirer `.example` à la fin du nom** pour qu'il devienne **`.env`**.

1. Renomme le fichier `.env.example` en `.env` (retire juste `.example` à la fin du nom, rien d'autre).
2. Ouvre ce fichier `.env` avec un éditeur de texte (VS Code par exemple).

Il ressemble à ça :

```env
DATABASE_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="remplace-moi-par-nimporte-quoi"

STRIPE_SECRET_KEY="sk_test_remplace_moi"
STRIPE_WEBHOOK_SECRET="whsec_remplace_moi"
```

Remplace uniquement les valeurs suivantes :

- `STRIPE_SECRET_KEY` : une clé de test Stripe. Elle se récupère sur https://dashboard.stripe.com/test/apikeys (il faut un compte Stripe, gratuit). Elle commence toujours par `sk_test_`.
- `STRIPE_WEBHOOK_SECRET` : cette valeur sera obtenue à l'étape 7. Pour l'instant, laisse-la telle quelle.
- `NEXTAUTH_SECRET` : remplace `remplace-moi-par-nimporte-quoi` par n'importe quelle suite de caractères (peu importe laquelle, il n'y a pas de piège).

**Ne partage jamais ce fichier `.env` publiquement** (il contient des clés secrètes).

---

## Étape 5 — Créer la base de données

Toujours dans le terminal, copie-colle :

```bash
npx prisma migrate dev
```

Cette commande crée un fichier `dev.db` : c'est la base de données de l'application (elle est vide au départ).

---

## Étape 6 — Démarrer l'application

Copie-colle :

```bash
npm run dev
```

Le terminal doit afficher quelque chose comme :

```
- Local: http://localhost:3000
```

Ouvre ton navigateur internet et va à l'adresse : **http://localhost:3000**

L'application doit s'afficher. **Laisse ce terminal ouvert** pendant toute la durée du test (ne le ferme pas).

---

## Étape 7 — Activer les notifications Stripe (webhook)

Cette étape est nécessaire pour que l'abonnement Premium et l'historique des commandes se mettent à jour automatiquement après un paiement.

1. Installe l'outil Stripe CLI :
   - Sur Mac : `brew install stripe/stripe-cli/stripe`
   - Sur Windows/Linux : voir https://docs.stripe.com/stripe-cli#install

2. Ouvre un **nouveau terminal** (sans fermer celui de l'étape 6), place-toi dans le dossier du projet, et tape :

```bash
stripe login
```

Suis les instructions à l'écran (ça ouvre une page dans le navigateur, il faut cliquer sur "Autoriser").

3. Une fois connecté, toujours dans ce même terminal, lance :

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Le terminal affiche une ligne du type :

```
Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Copie cette valeur (`whsec_...`) et colle-la dans le fichier `.env`, à la place de `STRIPE_WEBHOOK_SECRET`.

5. Retourne dans le terminal de l'étape 6, arrête-le (touches `Ctrl` + `C`), puis relance :

```bash
npm run dev
```

(Il faut relancer car le fichier `.env` a changé.)

**Laisse aussi ce deuxième terminal ouvert** (celui avec `stripe listen`) pendant tout le test.

---

## Étape 8 — Tester l'application

### 8.1 — Créer un compte

1. Sur http://localhost:3000, clique sur **"S'inscrire"**.
2. Remplis le formulaire avec n'importe quel email et un mot de passe (8 caractères minimum).
3. Valide. Tu es maintenant connecté.

### 8.2 — Acheter un produit (paiement unique)

1. Clique sur **"Boutique"**.
2. Choisis un produit et clique sur **"Acheter"**.
3. Tu arrives sur une page de paiement Stripe. Utilise cette carte de test :

   - Numéro de carte : `4242 4242 4242 4242`
   - Date d'expiration : n'importe quelle date future (ex : `12/30`)
   - Code CVC : n'importe quel nombre à 3 chiffres (ex : `123`)
   - Nom, code postal : n'importe quoi

4. Valide le paiement. Tu es redirigé vers une page de confirmation.
5. Clique sur **"Mes commandes"** dans le menu : la commande doit apparaître dans la liste.

### 8.3 — S'abonner à l'espace Premium

1. Clique sur **"Premium"**.
2. Un message indique que cet espace est réservé aux abonnés, avec un bouton **"S'abonner"**.
3. Clique dessus, puis paie avec la même carte de test que ci-dessus (`4242 4242 4242 4242`).
4. Une fois le paiement validé, reviens sur la page **"Premium"** : le contenu exclusif doit maintenant s'afficher.

### 8.4 — Vérifier que tout fonctionne

- Si l'achat et l'abonnement fonctionnent comme décrit ci-dessus, l'application fonctionne correctement.
- Dans le terminal `stripe listen` (étape 7), on doit voir des lignes `[200] POST .../api/webhooks/stripe` après chaque paiement : ça confirme que la notification a bien été reçue et traitée par l'application.

---

## En cas de blocage

- Si la page ne s'affiche pas : vérifie que le terminal de l'étape 6 (`npm run dev`) est toujours ouvert et n'affiche pas d'erreur en rouge.
- Si le paiement ne se valide pas : vérifie que `STRIPE_SECRET_KEY` dans `.env` est correcte et commence bien par `sk_test_`.
- Si l'abonnement ne s'active pas après paiement : vérifie que le terminal `stripe listen` (étape 7) est toujours ouvert, et que `STRIPE_WEBHOOK_SECRET` dans `.env` correspond bien à celui affiché par `stripe listen`.

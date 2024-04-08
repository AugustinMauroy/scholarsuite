# ScholarSuite

Merci de vouloir contribuer à ScholarSuite. Nous sommes ravis de vous accueillir dans notre communauté. Avant de commencer, veuillez lire ce document pour comprendre comment vous pouvez contribuer à ce projet.

## Comment contribuer

1. Créez un fork du dépôt ScholarSuite.
2. Clonez le dépôt ScholarSuite sur votre machine locale.

```bash
git clone git@github.com:<YOUR_GITHUB_USERNAME>/scholarsuite.git # SSH
git clone https://github.com/<YOUR_GITHUB_USERNAME>/scholarsuite.git # HTTPS
gh repo clone <YOUR_GITHUB_USERNAME>/scholarsuite # GitHub CLI
```

3. Changez de répertoire vers le dépôt cloné.

```bash
cd scholarsuite
```

4. Créez une branche pour votre contribution.

```bash
git checkout -b <BRANCH_NAME>
```

5. Démarrez l'environnement de développement.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:seed-dev
npx turbo dev # or turbo dev if you have Turbo installed globally
```

Ci-dessus, nous commençons par installer les dépendances du projet, puis nous copions le fichier `.env.example` en `.env` pour définir les variables d'environnement _(pensez à le mettre à jour selon votre environnement)_. Ensuite, nous générons les migrations et les exécutons pour créer les tables de la base de données. Enfin, nous démarrons l'environnement de développement.

6. Faites vos modifications.

7. Formatez votre code.

```bash
turbo format # or npx turbo format
```

10. Dès que vous avez terminé, créez un commit de vos modifications.

```bash
git add .
git commit -m "Your commit message"
```

> [!NOTE]
> Veuillez suivre les directives de commit décrites ci-dessous.

## Directives de commit

Ce projet suit la spécification [Conventional Commits][].

Les commits doivent être signés. Vous pouvez en savoir plus sur [Commit Signing][] ici.

### Directives de message de commit

- Les messages de commit doivent inclure un "type" tel que décrit sur Conventional Commits
- Les messages de commit **doivent** commencer par une lettre majuscule
- Les messages de commit **ne doivent pas** se terminer par un point `.`
- Les messages de commit **doivent** être en anglais _désolé pour la contrainte_

[Conventional Commits]: https://www.conventionalcommits.org/
[Commit Signing]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits

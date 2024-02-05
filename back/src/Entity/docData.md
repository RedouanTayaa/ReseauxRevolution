## Documentation de la Base de Données

### Entity: User

| Propriété     | Type                 | Nullable | Description                                              |
|---------------|----------------------|----------|----------------------------------------------------------|
| id            | int                  | Non      | Identifiant unique de l'utilisateur.                     |
| email         | string (255 caractères) | Non      | Adresse email de l'utilisateur.                          |
| password      | string (255 caractères) | Non      | Mot de passe de l'utilisateur.                           |
| hasPaid       | bool                 | Non      | Indique si l'utilisateur a effectué un paiement.          |
| createdAt     | DateTimeImmutable    | Non      | Date et heure de création du compte utilisateur.         |
| updatedAt     | DateTimeImmutable    | Oui      | Date et heure de la dernière mise à jour du compte utilisateur. |
| profile       | Profile              | Oui      | Profil associé à l'utilisateur.                           |
| publications  | Collection           | Non      | Publications associées à l'utilisateur.                   |

### Entity: Publication

| Propriété     | Type                 | Nullable | Description                                              |
|---------------|----------------------|----------|----------------------------------------------------------|
| id            | int                  | Non      | Identifiant unique de la publication.                    |
| userId        | User                 | Non      | Utilisateur ayant créé la publication.                    |
| content       | text                 | Non      | Contenu de la publication.                                |
| OpenAiContext | text                 | Non      | Contexte envoyé à OpenAI.                                 |
| OpenAiResponse| text                 | Non      | Réponse reçue de OpenAI.                                  |
| createdAt     | DateTimeImmutable    | Non      | Date et heure de création de la publication.              |
| updatedAt     | DateTimeImmutable    | Oui      | Date et heure de la dernière mise à jour de la publication.|

### Entity: Profile

| Propriété     | Type                 | Nullable | Description                                              |
|---------------|----------------------|----------|----------------------------------------------------------|
| id            | int                  | Non      | Identifiant unique du profil.                            |
| userId        | User                 | Non      | Utilisateur associé au profil.                           |
| firstName     | string (100 caractères) | Non      | Prénom de l'utilisateur.                                 |
| lastName      | string (100 caractères) | Non      | Nom de l'utilisateur.                                    |
| createdAt     | DateTimeImmutable    | Non      | Date et heure de création du profil.                     |
| updatedAt     | DateTimeImmutable    | Oui      | Date et heure de la dernière mise à jour du profil.       |

## Préconisations


2. **Indexes**:
    - Pour améliorer les performances de la base de données, envisagez d'ajouter des indexes sur les colonnes fréquemment recherchées ou ordonnées, comme `email` dans l'entité `User`.

3. **Validation**:
    - Ajoutez des validations sur les propriétés des entités pour garantir que les données respectent certaines contraintes (par exemple, la validation d'email, la longueur minimale du mot de passe, etc.).

4. **Cascade Operations**:
    - Revoyez les opérations en cascade sur les relations entre entités pour vous assurer qu'elles correspondent à la logique métier souhaitée (par exemple, si un `User` est supprimé, ses `Publications` et `Profile` doivent-ils également être supprimés ?).

5. **Audit Trail**:
    - Si le suivi des modifications est important, envisagez d'ajouter des propriétés supplémentaires pour suivre qui a créé ou modifié une entité et quand.

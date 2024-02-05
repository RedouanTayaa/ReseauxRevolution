# POST /api/completion

## Description

Cet endpoint génère une complétion de texte à partir d'un sujet et d'une technique d'écriture donnés.

## Entrées

- `topic` (string): Le sujet sur lequel le texte doit être basé. Doit être une chaîne de caractères non vide.
- `writingTechnique` (array): Un tableau contenant une ou plusieurs techniques d'écriture à utiliser pour générer le texte. Les valeurs possibles sont "AIDA", "PAS", "FAB", "QUEST", "ACC", "The 4 U’s".

## Sorties

Si la requête est réussie, l'API renvoie :

- **Code de statut HTTP** : `200`
- **Objet JSON** contenant :
  - `id` (string): L'identifiant unique de la complétion.
  - `object` (string): Le type d'objet, qui sera toujours "chat.completion".
  - `created` (integer): Le timestamp de la création de la complétion.
  - `model` (string): Le nom du modèle utilisé pour générer la complétion.
  - `usage` (object): Un objet contenant des informations sur l'utilisation de l'API. Inclut :
    - `prompt_tokens` (integer): Le nombre de tokens utilisés pour le prompt.
    - `completion_tokens` (integer): Le nombre de tokens utilisés pour la complétion.
  - `choices` (array): Un tableau contenant les complétions générées. Chaque élément est un objet contenant :
    - `message` (object): Un objet contenant :
      - `role` (string): Qui sera toujours "assistant".
      - `content` (string): Le texte de la complétion.

En cas d'erreur, l'API renvoie :

- **Code de statut HTTP** : approprié selon l'erreur.
- **Objet JSON** contenant :
  - `message` (string): Le message d'erreur. 

## Messages d'erreur possibles

- `Invalid data received`: Si les données reçues ne contiennent pas les champs `topic` et `writingTechnique`.
- `Invalid topic`: Si le `topic` reçu est une chaîne vide après avoir été nettoyé.
- `Failed to get completion from OpenAI`: Si une exception est levée lors de l'appel à la méthode `postCompletion`.

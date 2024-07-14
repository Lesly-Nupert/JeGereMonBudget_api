# JeGereMonBudget_api
***
L'API REST JeGereMonBudget_api est un serveur développé pour stocker et gérer les données de l'application frontale : [https://jegeremonbudget.netlify.app]  
L'API est hébergée sur Railway 

## Technologies et Bibliothèques utilisées
***

* Express.js: Un framework web pour Node.js, utilisé pour construire des API.

* PostgreSQL: Le système de gestion de base de données relationnelle utilisé pour stocker les données de l'application.

* Sequelize: ORM (Object-Relational Mapping) pour Node.js qui facilite les interactions avec les bases de données relationnelles, en permettant de manipuler les données en utilisant des objets JavaScript plutôt que des requêtes SQL.

* bcryptjs: Utilisé pour le hachage des mots de passe. (+ salt) 

* CORS (Cross-Origin Resource Sharing): Permet de gérer les politiques de partage de ressources entre différentes origines.

* dotenv: Pour gérer les variables d'environnement de l'application.

* email-validator: Pour valider les adresses email lors de l'inscription ou d'autres opérations nécessitant une validation d'email.

* jsonwebtoken (JWT): Utilisé pour l'authentification et la gestion des sessions via des tokens.

* Helmet: Sécurisation des applis Express (xss...)

* Sanitize-html: Nettoie le code HTML (xss)

## Outil de développement
***
* Nodemon: Utilisé en développement pour redémarrer automatiquement le serveur Node.js à chaque modification de fichier.

* Sequelize-cli (Command Line Interface) : Un outil qui facilite la gestion des modèles (il pourrait être utilisé pour gérer les migrations et les seeder)
  
## Installation
***
1 Cloner le dépôt
```
git clone https://github.com/Lesly-Nupert/JeGereMonBudget_api
```
2 Aller dans le repertoire du projet
```
cd /chemin/du/projet
```
3 Installer les packages NPM
```
npm install
```
4 Lancer le serveur local
```
npm run dev
```

## Licence 
***
Distribué sous licence ISC. Voir ```LICENSE.txt``` pour plus d'informations.
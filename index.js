// Charge les variables d'environnement à partir d'un fichier .env
// A mettre tout en haut du point d'entrée de l'application pour être sûr que les variables sont bien accessibles.
require('dotenv').config();

// Middlewarre CORS :
// Cross-Origin Resource Sharing rend l'API accessible en toute sécurité à différents clients (domaine, protocole ou port) 
const cors = require('cors');

// Importe le framework Express
const express = require('express');

//Importe le middleware Helmet 
const helmet = require('helmet');

// Initialisation de Express
const app = express();

// Acitvation de Helmet
app.use(helmet());

// Activation de CORS pour l'URL de production
const corsOptions = {
    origin: 'https://jegeremonbudget.netlify.app',
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// Parse les données d'un formulaire
// Dans insomnia et Fetch mettre le Content-Type à application x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse données JSON
app.use(express.json());

// Importe les routes de l'application
const router = require('./router');
app.use(router); 

// Port sur lequel l'appli va écouter + URL de base 
app.set('PORT', process.env.PORT || 8080);
app.set('URL', process.env.BASE_URL_PROD || 'https://jegeremonbudgetapi.up.railway.app/');

app.listen(app.get('PORT'), () => {
    console.log(`Listening on ${app.get('URL')}:${app.get('PORT')}`);
});
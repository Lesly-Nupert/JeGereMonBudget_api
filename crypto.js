// Fonction pour générer un token secret
const crypto = require('crypto');
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }
console.log(generateToken());
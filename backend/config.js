const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { generateSecretKey };

app.use(session({
  secret: 'votre_clé_secrète', // Une chaîne de caractères aléatoire pour signer la session, assurez-vous de la garder sécurisée
  resave: false,
  saveUninitialized: true
}));


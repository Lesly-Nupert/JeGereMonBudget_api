// *MIDDLEWARE AUTHENTIFICATION JWT
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Token requis');

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token invalide ou expiré');
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;




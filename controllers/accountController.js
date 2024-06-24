const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const accountController = {
    // Créer un compte
    addAccount: async (req, res) => {
        try {
            const newAccount = await Account.create({
                name: sanitizeHtml(req.body.name),
                user_id: req.user.userId,
            });
            res.status(201).json(newAccount);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

};

module.exports = accountController;
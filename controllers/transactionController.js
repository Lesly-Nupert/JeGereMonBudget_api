const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const transactionController = {
    // Créer un revenu
    addIncome: async (req, res) => {
        try {
            const newIncome = await Transaction.create({
                amount: sanitizeHtml(req.body.amount),
                name: sanitizeHtml(req.body.name),
                type: 'revenus',
                account_id: req.params.id,
            });
            res.status(201).json(newIncome);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // Créer une dépense
    addExpense: async (req, res) => {
        try {
            const newExpense = await Transaction.create({
                amount: sanitizeHtml(req.body.amount),
                name: sanitizeHtml(req.body.name),
                type: 'depenses',
                account_id: req.params.id,
            });
            res.status(201).json(newExpense);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

};

module.exports = transactionController;
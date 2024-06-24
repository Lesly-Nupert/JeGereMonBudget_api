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

    // Modifier un revenu
    updateIncome: async (req, res) => {
        try {
            const accountId = req.params.id;
            const updateIncome = {
                amount: sanitizeHtml(req.body.amount),
                name: sanitizeHtml(req.body.name),
                type: 'revenus',
            };

            await Transaction.update(updateIncome, { where: { id: accountId } });
            res
                .status(200)
                .json({ message: "Revenu mis à jour avec succès" });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({
                    error: "Erreur serveur lors de la mise à jour du revenu",
                });
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
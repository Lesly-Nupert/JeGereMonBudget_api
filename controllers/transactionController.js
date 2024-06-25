const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const transactionController = {
    // ! REVENUS

    // * Créer un revenu
    addIncome: async (req, res) => {
        try {
            const newIncome = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'revenus',
                user_id: req.user.userId,
                account_id: req.params.id,
            });
            res.status(201).json(newIncome);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Modifier un revenu 
    updateIncome: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId
            const updateIncome = {
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'revenus',
            };
            // Vérifie si le revenu existe et appartient à l'utilisateur et au compte 
            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: 'revenus',
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Revenu non trouvé" });
                return;
            }
            // Met à jour le revenu
            await Transaction.update(updateIncome,
                {
                    where: {
                        id: transactionId,
                        user_id: userId,
                        account_id: accountId,
                        type: 'revenus',
                    }
                });
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

    // * Supprimer un revenu
    deleteIncome: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId;
            const type = 'revenus';

            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Revenu non trouvé" });
                return;
            }
            await Transaction.destroy({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });

            res.status(200).json({ message: "Revenu supprimé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Erreur serveur lors de la suppression du revenu",
            });
        }
    },

    // * Obtenir un revenu
    getOneIncome: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId;
            const type = 'revenus';

            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Revenu non trouvé" });
                return;
            }
            res.status(200).json(transaction);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // ! DEPENSES

    // * Créer une dépense
    addExpense: async (req, res) => {
        try {
            const newExpense = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'depenses',
                user_id: req.user.userId,
                account_id: req.params.id,
            });
            res.status(201).json(newExpense);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Modifier une dépense
    updateExpense: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId
            const updateExpense = {
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'depenses',
            };
            // Vérifie si la dépense existe et appartient à l'utilisateur et au compte 
            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: 'depenses',
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Dépense non trouvée" });
                return;
            }
            // Met à jour la dépense
            await Transaction.update(updateExpense,
                {
                    where: {
                        id: transactionId,
                        user_id: userId,
                        account_id: accountId,
                        type: 'depenses',
                    }
                });
            res
                .status(200)
                .json({ message: "Dépense mise à jour avec succès" });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({
                    error: "Erreur serveur lors de la mise à jour de la dépense",
                });
        }
    },

    // * Supprimer une dépense
    deleteExpense: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId;
            const type = 'depenses';

            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Dépense non trouvée" });
                return;
            }
            await Transaction.destroy({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });

            res.status(200).json({ message: "Dépense supprimée avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Erreur serveur lors de la suppression de la dépense",
            });
        }
    },

    // * Obtenir une dépense
    getOneExpense: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId;
            const type = 'depenses';

            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: type,
                },
            });
            if (!transaction) {
                res.status(404).json({ error: "Dépense non trouvée" });
                return;
            }
            res.status(200).json(transaction);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },








    
};

module.exports = transactionController;
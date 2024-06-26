const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const transactionController = {
    // ! REVENUS

    // * Créé un revenu et met à jour le solde du compte
    addIncomeAndIncrementAccountBalance: async (req, res) => {
        try {
            const newIncome = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'revenus',
                user_id: req.user.userId,
                account_id: req.params.id,
            });
            if (!newIncome) {
                res.status(400).json({ error: "Impossible de créer le revenu" });
                return;
            }
            // Met à jour le solde du compte
            await Account.increment('balance', {
                by: newIncome.amount,
                where: {
                    id: req.params.id,
                },
            });

            res.status(201).json(newIncome);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Modifier un revenu et mettre à jour le solde du compte
    updateIncomeAndIncrementAccountBalance: async (req, res) => {
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
                return res.status(404).json({ error: "Revenu non trouvé" });
            }

            // Met à jour le solde du compte en retirant l'ancien montant
            await Account.increment('balance', {
                by: -transaction.amount,
                where: {
                    id: accountId,
                },
            });

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
            // Met à jour le solde du compte
            await Account.increment('balance', {
                by: updateIncome.amount,
                where: {
                    id: accountId,
                },
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
    deleteIncomeAndDecrementAccountBalance: async (req, res) => {
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
            // Met à jour le solde du compte
            await Account.decrement('balance', {
                by: transaction.amount,
                where: {
                    id: accountId,
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
    addExpenseAndIncrementAccountBalance: async (req, res) => {
        try {
            const newExpense = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: sanitizeHtml(req.body.amount),
                type: 'depenses',
                user_id: req.user.userId,
                account_id: req.params.id,
            });
            if (!newExpense) {
                res.status(400).json({ error: "Impossible de créer la dépense" });
                return;
            }
            // Met à jour le solde du compte
            await Account.increment('balance', {
                by: newExpense.amount,
                where: {
                    id: req.params.id,
                },
            });

            res.status(201).json(newExpense);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Modifier une dépense
    updateExpenseAndIncrementAccountBalance: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const transactionId = req.params.transactionId
            const updateIncome = {
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
                return res.status(404).json({ error: "Dépense non trouvée" });
            }
    
            // Met à jour le solde du compte en retirant l'ancien montant
            await Account.increment('balance', {
                by: -transaction.amount,
                where: {
                    id: accountId,
                },
            });
    
            // Met à jour la dépense
            await Transaction.update(updateIncome,
                {
                    where: {
                        id: transactionId,
                        user_id: userId,
                        account_id: accountId,
                        type: 'depenses',
                    }
                });
            // Met à jour le solde du compte
            await Account.increment('balance', {
                by: updateIncome.amount,
                where: {
                    id: accountId,
                },
            });
            res
                .status(200)
                .json({ message: "Dépense mis à jour avec succès" });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({
                    error: "Erreur serveur lors de la mise à jour de la dépense",
                });
        }
    },

    // * Supprimer une dépense et mettre à jour le solde du compte
    deleteExpenseAndDecrementAccountBalance: async (req, res) => {
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
            // Met à jour le solde du compte
            await Account.decrement('balance', {
                by: transaction.amount,
                where: {
                    id: accountId,
                },
            });

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
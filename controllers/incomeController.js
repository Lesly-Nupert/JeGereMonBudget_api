const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const incomeController = {

    // ! REVENUS

    // * Créé un revenu et met à jour le solde du compte
    addIncomeAndIncrementAccountBalance: async (req, res) => {
        try {
            // parseFloat pour convertir en nombre décimal
            // Et éviiter les erreurs NaN
            const amount = parseFloat(sanitizeHtml(req.body.amount)); 

            const newIncome = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: amount, 
                type: 'revenus',
                user_id: req.user.userId,
                account_id: req.params.id,

                // Ajouter pour tester la date avec insomnia pour le mois d'aout sinon pas besoin
                // created_at: req.body.created_at,
            });

            if (!newIncome) {
                res.status(400).json({ error: "Impossible de créer le revenu" });
                return;
            }
            // J'ajoute le montant du revenu à la balance du compte
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
        const { userId, accountId, transactionId } = req.params;
        const { transaction_name, amount } = req.body;
    
        try {
            // Trouver la transaction existante
            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: 'revenus',
                },
            });
    
            if (!transaction) {
                return res.status(404).json({ error: 'Revenu non trouvé' });
            }
    
            // Trouver le compte associé
            const account = await Account.findOne({
                where: {
                    id: accountId,
                    user_id: userId,
                },
            });
    
            if (!account) {
                return res.status(404).json({ error: 'Compte non trouvé' });
            }
    
            // Calculer la nouvelle balance
            const oldAmount = parseFloat(transaction.amount);
            const newAmount = parseFloat(amount);
            // Je soustrait l'ancien montant et j'ajoute le nouveau montant
            account.balance = parseFloat(account.balance) - oldAmount + newAmount;
    
            // Mettre à jour la transaction et la balance
            await transaction.update({
                transaction_name: sanitizeHtml(transaction_name),
                amount: newAmount
            });
            await account.save();
    
            res.status(200).json({ message: 'Revenu mis à jour et balance ajustée', transaction, account });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    // * Supprimer un revenu et mettre à jour le solde du compte
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

};
module.exports = incomeController;




















const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const expenseController = {

    // ! DEPENSES

    // * Créer une dépense
    addExpenseAndIncrementAccountBalance: async (req, res) => {
        try {
            // parseFloat pour convertir en nombre décimal
            // Et éviiter les erreurs NaN
            const amount = parseFloat(sanitizeHtml(req.body.amount)); 
    
            const newExpense = await Transaction.create({
                transaction_name: sanitizeHtml(req.body.transaction_name),
                amount: amount, 
                type: 'depenses',
                user_id: req.user.userId,
                account_id: req.params.id,
            });
    
            if (!newExpense) {
                res.status(400).json({ error: "Impossible de créer la dépense"});
                return;
            }
    
            // J'enlève le montant de la dépense à la balance du compte
            await Account.decrement('balance', {
                by: amount,
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
        const { userId, accountId, transactionId } = req.params;
        const { transaction_name, amount } = req.body;
    
        try {
            // Trouver la transaction existante
            const transaction = await Transaction.findOne({
                where: {
                    id: transactionId,
                    user_id: userId,
                    account_id: accountId,
                    type: 'depenses',
                },
            });
    
            if (!transaction) {
                return res.status(404).json({ error: 'Dépense non trouvée' });
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
            // J'ajoute l'ancien montant et je soustrais le nouveau montant
            // Méthode plus simple qu'avec increment et decrement
            account.balance = parseFloat(account.balance) + oldAmount - newAmount;
    
            // Mettre à jour la transaction et la balance
            await transaction.update({
                transaction_name: sanitizeHtml(transaction_name),
                amount: newAmount
            });
            await account.save();
    
            res.status(200).json({ message: 'Dépense mise à jour et balance ajustée', transaction, account });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
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
            // Met à jour le solde du compte
            await Account.increment('balance', {
                by: transaction.amount,
                where: {
                    id: accountId,
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

module.exports = expenseController;
















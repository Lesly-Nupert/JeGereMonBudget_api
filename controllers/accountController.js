const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const accountController = {
    // * Créer un compte
    addAccount: async (req, res) => {
        try {
            const account_name = sanitizeHtml(req.body.account_name);
            if (!account_name) {
                return res.status(400).json({ error: "Le nom du compte est obligatoire." });
            }
            const newAccount = await Account.create({
                account_name,
                user_id: req.user.userId,
            });

            res.status(201).json(newAccount);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Modifier un compte
    updateAccount: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            const updateAccount = {
                account_name: sanitizeHtml(req.body.account_name),
            };
            // Vérifie si le compte existe et appartient à l'utilisateur
            const account = await Account.findOne({
                where: {
                    id: accountId,
                    user_id: userId,
                },
            });
            if (!account) {
                res.status(404).json({ error: "Compte non trouvé" });
                return;
            }
            // Met à jour le compte
            await Account.update(updateAccount,
                {
                    where: {
                        id: accountId,
                        user_id: userId,
                    }
                });
            res
                .status(200)
                .json({ message: "Nom du compte modifié !" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Supprimer un compte avec ses transactions (ON DELETE CASCADE configuré dans les associations des modèles Account et Transaction)
    deleteAccountWithTansactions: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            // Vérifie si le compte existe et appartient à l'utilisateur
            const account = await Account.findOne({
                where: {
                    id: accountId,
                    user_id: userId,
                },
            });
            if (!account) {
                res.status(404).json({ error: "Compte non trouvé" });
                return;
            }
            // Supprime le compte et ses transactions
            await Account.destroy({
                where: {
                    id: accountId,
                    user_id: userId,
                },
            });
            res.status(200).json({ message: "Compte supprimé avec succès !" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Un compte avec ses transactions
    getOneAccountWithTransactions: async (req, res) => {
        try {
            const userId = req.user.userId;
            const accountId = req.params.accountId;
            // Vérifie si le compte existe et appartient à l'utilisateur
            const account = await Account.findOne({
                where: {
                    id: accountId,
                    user_id: userId,
                },
                include: 'transactions',
            });
            if (!account) {
                res.status(404).json({ error: "Compte non trouvé" });
                return;
            }
            res.status(200).json(account);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    // * Tous les comptes d'un utilisateur avec les transactions 
    getAllAccountsWithTransactions: async (req, res) => {
        try {
            const userId = req.user.userId;
 
            const accounts = await Account.findAll({
                where: {
                    user_id: userId,
                },
                include: 'accounts',
                include: 'transactions',
                
            });
            if (!accounts) {
                res.status(404).json({ error: "Comptes non trouvés" });
                return;
            }
            res.status(200).json(accounts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },
};

module.exports = accountController;
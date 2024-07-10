const { User, Account, Transaction } = require('../models');

const userController = {
    // Obtenir tous les utilisateurs avec leurs comptes et transactions
    showAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                // include: [
                //     {
                //         model: Account,
                //         as: 'accounts',
                //         include: {
                //             model: Transaction,
                //             as: 'transactions'
                //         }
                //     }
                // ]

                include: [
                    {
                        association: 'accounts',
                        include: {
                            association: 'transactions'
                        }
                    }
                ]
            });
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },
};

module.exports = userController;
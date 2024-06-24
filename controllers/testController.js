const { User, Account, Transaction } = require('../models');
// Sanitize les données pour contrer attaque XSS
// const sanitizeHtml = require('sanitize-html');

const testController = {
    test: async (req, res) => {
        try {
            const users = await User.findAll({
                include: [
                    {
                        model: Account,
                        as: 'accounts',
                        include: [
                            {
                                model: Transaction,
                                as: 'transactions'
                            }
                        ]
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

module.exports = testController;
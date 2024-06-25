'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    // Méthode d'aide pour définir des associations (associate)
    // Cette méthode ne fait pas partie du cycle de vie de Sequelize.
    // Le fichier `models/index` appellera cette méthode automatiquement.
    static associate(models) {
      // Définir les associations ici
      // Une transaction appartient à un compte
      Transaction.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'accounts',
        onDelete: 'CASCADE'
      });
      // Une transaction appartient à un utilisateur
      Transaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'users',
        onDelete: 'CASCADE'
      });
    }
  }
  Transaction.init({
    transaction_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['revenus', 'depenses']]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Transaction',
    tableName: 'transaction'
  });
  return Transaction;
};
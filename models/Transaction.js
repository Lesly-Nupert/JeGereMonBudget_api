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
      Transaction.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'accounts'
      });
    }
  }
  Transaction.init({
    amount: {
      type: DataTypes.DECIMAL(10, 2),  
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['revenus', 'dépenses']]
      }
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        foreignKey: true
      }
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
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    // Méthode d'aide pour définir des associations (associate)
    // Cette méthode ne fait pas partie du cycle de vie de Sequelize.
    // Le fichier `models/index` appellera cette méthode automatiquement.
    static associate(models) {
      // Définir les associations ici
      // Un compte appartient à un utilisateur
      Account.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'users'
      });
      // Un compte peut avoir plusieurs transactions
      Account.hasMany(models.Transaction, {
        foreignKey: 'account_id',
        as: 'transactions',
        onDelete: 'CASCADE'
      });
    }
  }
  Account.init({
    account_name:{ 
      type: DataTypes.STRING,
      allowNull: false,
      },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },  
  }, {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Account',
    tableName: 'account'
  });
  return Account;
};







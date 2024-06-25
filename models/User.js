'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Méthode d'aide pour définir des associations (associate)
    // Cette méthode ne fait pas partie du cycle de vie de Sequelize.
    // Le fichier `models/index` appellera cette méthode automatiquement.
    static associate(models) {
      // Définir les associations ici
      // Un utilisateur peut avoir plusieurs comptes
      User.hasMany(models.Account, {
        foreignKey: 'user_id',
        as: 'accounts',
        onDelete: 'CASCADE'
      });
      
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Le nom d'utilisateur doit contenir entre 3 et 30 caractères"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'User',
    tableName: 'user'

  });
  return User;
};
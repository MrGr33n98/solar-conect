'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      // define association here
      Company.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner' // Optional alias
      });
    }
  }
  Company.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    contactEmail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false // This should align with the migration
    }
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};
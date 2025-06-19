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
      Company.belongsToMany(models.Category, {
        through: models.CompanyCategory, // Use the model for clarity if defined
        foreignKey: 'companyId',
        otherKey: 'categoryId',
        as: 'categories'
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
    },
    // New attributes
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    addressLine1: { type: DataTypes.STRING, allowNull: true },
    addressLine2: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true },
    logoUrl: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
    bannerUrl: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
    valueIndicator: { type: DataTypes.STRING, allowNull: true }, // e.g., "$", "$$", "$$$"
    strengths: { type: DataTypes.TEXT, allowNull: true }, // Could be JSON or comma-separated string
    warrantyDetails: { type: DataTypes.TEXT, allowNull: true },
    servicesOffered: { type: DataTypes.TEXT, allowNull: true }, // Could be JSON or comma-separated string
    brandsWorkedWith: { type: DataTypes.TEXT, allowNull: true } // Could be JSON or comma-separated string
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};
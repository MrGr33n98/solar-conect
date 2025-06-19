'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyCategory extends Model {
    static associate(models) {
      // Optional: Define direct associations to Company and Category if needed for specific queries
      // CompanyCategory.belongsTo(models.Company, { foreignKey: 'companyId' });
      // CompanyCategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  CompanyCategory.init({
    // If you added 'id' as PK in migration, define it here:
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Companies', key: 'id' } // Optional in model, defined in migration
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Categories', key: 'id' } // Optional in model, defined in migration
    }
  }, {
    sequelize,
    modelName: 'CompanyCategory',
    // If you did not add an 'id' PK and rely on composite (companyId, categoryId)
    // then Sequelize handles this via the `through` model in belongsToMany associations.
    // No explicit primaryKey: true needed here for the composite key in the model itself.
    // Timestamps (createdAt, updatedAt) are also added by default by the migration.
    // If you want to disable them for the join table model: timestamps: false
  });
  return CompanyCategory;
};
'use strict';
const { Model } = require('sequelize');

// Helper function to generate slug (optional, can be done in hooks or controller)
const generateSlug = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Company, {
        through: models.CompanyCategory, // Use the model for clarity if defined
        foreignKey: 'categoryId',
        otherKey: 'companyId',
        as: 'companies'
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "Category name cannot be empty." } }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "Category slug cannot be empty." } }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      beforeValidate: (category, options) => {
        if (category.name && !category.slug) {
          category.slug = generateSlug(category.name);
        } else if (category.slug) { // Ensure provided slug is also formatted
          category.slug = generateSlug(category.slug);
        }
      }
    }
  });
  return Category;
};
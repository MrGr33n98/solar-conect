'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Companies', 'city', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'state', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'addressLine1', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'addressLine2', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'postalCode', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'logoUrl', { type: Sequelize.STRING, allowNull: true }); // Validation is in model
    await queryInterface.addColumn('Companies', 'bannerUrl', { type: Sequelize.STRING, allowNull: true }); // Validation is in model
    await queryInterface.addColumn('Companies', 'valueIndicator', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Companies', 'strengths', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Companies', 'warrantyDetails', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Companies', 'servicesOffered', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('Companies', 'brandsWorkedWith', { type: Sequelize.TEXT, allowNull: true });

    await queryInterface.addIndex('Companies', ['city']);
    await queryInterface.addIndex('Companies', ['state']);
  },

  async down(queryInterface, Sequelize) {
    // Important to remove indexes before columns
    await queryInterface.removeIndex('Companies', ['state']);
    await queryInterface.removeIndex('Companies', ['city']);

    await queryInterface.removeColumn('Companies', 'brandsWorkedWith');
    await queryInterface.removeColumn('Companies', 'servicesOffered');
    await queryInterface.removeColumn('Companies', 'warrantyDetails');
    await queryInterface.removeColumn('Companies', 'strengths');
    await queryInterface.removeColumn('Companies', 'valueIndicator');
    await queryInterface.removeColumn('Companies', 'bannerUrl');
    await queryInterface.removeColumn('Companies', 'logoUrl');
    await queryInterface.removeColumn('Companies', 'postalCode');
    await queryInterface.removeColumn('Companies', 'addressLine2');
    await queryInterface.removeColumn('Companies', 'addressLine1');
    await queryInterface.removeColumn('Companies', 'state');
    await queryInterface.removeColumn('Companies', 'city');
  }
};

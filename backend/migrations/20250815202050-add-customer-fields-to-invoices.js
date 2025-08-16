'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'customerName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'customerPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'customerEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'customerStreet', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'customerArea', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Invoices', 'customerGovernorate', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'customerName');
    await queryInterface.removeColumn('Invoices', 'customerPhone');
    await queryInterface.removeColumn('Invoices', 'customerEmail');
    await queryInterface.removeColumn('Invoices', 'customerStreet');
    await queryInterface.removeColumn('Invoices', 'customerArea');
    await queryInterface.removeColumn('Invoices', 'customerGovernorate');
  }
};

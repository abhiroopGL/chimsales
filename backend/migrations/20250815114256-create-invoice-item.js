'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InvoiceItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Invoices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      quantity: Sequelize.INTEGER,
      unitPrice: Sequelize.FLOAT,
      total: Sequelize.FLOAT,
      productName: Sequelize.STRING,
      description: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InvoiceItems');
  }
};

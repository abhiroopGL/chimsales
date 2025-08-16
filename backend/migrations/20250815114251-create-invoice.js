'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      invoiceNumber: Sequelize.STRING,
      subtotal: Sequelize.FLOAT,
      taxRate: Sequelize.FLOAT,
      taxAmount: Sequelize.FLOAT,
      discountRate: Sequelize.FLOAT,
      discountAmount: Sequelize.FLOAT,
      total: Sequelize.FLOAT,
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'paid', 'overdue'),
        defaultValue: 'draft'
      },
      dueDate: Sequelize.DATE,
      paidDate: Sequelize.DATE,
      sentAt: Sequelize.DATE,
      notes: Sequelize.TEXT,
      terms: Sequelize.TEXT,
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
    await queryInterface.dropTable('Invoices');
  }
};

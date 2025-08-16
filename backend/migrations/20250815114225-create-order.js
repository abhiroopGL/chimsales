'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "processing", "shipped", "delivered", "cancelled"),
        allowNull: false,
        defaultValue: "pending"
      },
      paymentMethod: {
        type: Sequelize.ENUM("cash", "card", "bank_transfer"),
        allowNull: false,
        defaultValue: "cash"
      },
      paymentStatus: {
        type: Sequelize.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending"
      },
      notes: {
        type: Sequelize.TEXT
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
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
    await queryInterface.dropTable('Orders');
  }
};

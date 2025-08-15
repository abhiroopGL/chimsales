'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingNumber: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "pending"
      },
      paymentMethod: {
        type: Sequelize.ENUM("cash", "card", "bank_transfer"),
        allowNull: false,
        defaultValue: "cash"
      },
      notes: {
        type: Sequelize.TEXT
      },
      customerFullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customerEmail: {
        type: Sequelize.STRING
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryStreet: Sequelize.STRING,
      deliveryArea: Sequelize.STRING,
      deliveryGovernorate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryBlock: Sequelize.STRING,
      deliveryBuilding: Sequelize.STRING,
      deliveryFloor: Sequelize.STRING,
      deliveryApartment: Sequelize.STRING,
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
    await queryInterface.dropTable('Bookings');
  }
};

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Queries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fullName: Sequelize.STRING,
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: Sequelize.STRING,
      address: Sequelize.STRING,
      subject: Sequelize.STRING,
      message: Sequelize.TEXT,
      status: {
        type: Sequelize.ENUM('pending', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Queries');
  }
};

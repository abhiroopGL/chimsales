'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Query extends Model {
    static associate(models) {
      // Associate to user (optional)
      Query.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Query.init({
    userId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'in process', 'resolved'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Query',
  });

  return Query;
};

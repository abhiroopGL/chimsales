'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Cart, { foreignKey: 'userId', as: 'activeCart' });

    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: DataTypes.DATE,
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

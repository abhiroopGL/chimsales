'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId' });
    }
  }

  Cart.init({
    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Cart',
  });

  return Cart;
};

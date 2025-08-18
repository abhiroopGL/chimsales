'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });
      CartItem.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  CartItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }
    },
    name: DataTypes.STRING, // optional snapshot
    image: DataTypes.STRING, // optional snapshot
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CartItem',
  });

  return CartItem;
};

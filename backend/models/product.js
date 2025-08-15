'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
      Product.hasMany(models.CartItem, { foreignKey: 'productId' });
      Product.hasMany(models.InvoiceItem, { foreignKey: 'productId' });
      Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
    }
  }

  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'deleted'),
      allowNull: false,
      defaultValue: 'draft',
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};

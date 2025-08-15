'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    static associate(models) {
      // Each invoice item belongs to an invoice
      InvoiceItem.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice', onDelete: 'CASCADE' });

      // Optional: if you want to associate with product
      InvoiceItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product', onDelete: 'SET NULL' });
    }
  }

  InvoiceItem.init({
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    productName: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'InvoiceItem',
  });

  return InvoiceItem;
};

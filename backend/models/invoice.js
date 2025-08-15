'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.User, { foreignKey: 'createdById', as: 'createdBy' });
      Invoice.hasMany(models.InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
    }
  }

  Invoice.init({
    invoiceNumber: DataTypes.STRING,
    subtotal: DataTypes.FLOAT,
    taxRate: DataTypes.FLOAT,
    taxAmount: DataTypes.FLOAT,
    discountRate: DataTypes.FLOAT,
    discountAmount: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue'),
      defaultValue: 'draft'
    },
    dueDate: DataTypes.DATE,
    paidDate: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    notes: DataTypes.TEXT,
    terms: DataTypes.TEXT,

    // 📌 New customer snapshot fields
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: true },
    customerStreet: { type: DataTypes.STRING, allowNull: true },
    customerArea: { type: DataTypes.STRING, allowNull: true },
    customerGovernorate: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'Invoice',
  });

  return Invoice;
};

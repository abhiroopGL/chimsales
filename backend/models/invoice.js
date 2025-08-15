'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Each invoice belongs to a booking
      Invoice.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking', onDelete: 'CASCADE' });
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
    terms: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Invoice',
  });

  return Invoice;
};

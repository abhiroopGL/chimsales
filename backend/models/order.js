'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId', as : 'customer' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
      Order.hasOne(models.Invoice, { foreignKey: 'orderId' });
    }
  }

  Order.init({
    orderNumber: DataTypes.STRING,
    total: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "processing", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "card", "bank_transfer"),
      allowNull: false,
      defaultValue: "cash",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    notes: DataTypes.TEXT,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};

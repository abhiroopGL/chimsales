'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingItem extends Model {
    static associate(models) {
      // Each booking item belongs to a booking
      BookingItem.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking', onDelete: 'CASCADE' });

      // Each booking item belongs to a product
      BookingItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  BookingItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }
    }
  }, {
    sequelize,
    modelName: 'BookingItem',
  });

  return BookingItem;
};

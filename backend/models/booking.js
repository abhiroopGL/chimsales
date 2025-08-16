'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.hasMany(models.BookingItem, { foreignKey: 'bookingId', as: 'items', onDelete: 'CASCADE' });
    }
  }

  Booking.init({
    bookingNumber: DataTypes.STRING,
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending"
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash", "card", "bank_transfer"),
      allowNull: false,
      defaultValue: "cash"
    },
    notes: DataTypes.TEXT,
    customerFullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customerEmail: DataTypes.STRING,
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliveryStreet: DataTypes.STRING,
    deliveryArea: DataTypes.STRING,
    deliveryGovernorate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deliveryBlock: DataTypes.STRING,
    deliveryBuilding: DataTypes.STRING,
    deliveryFloor: DataTypes.STRING,
    deliveryApartment: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
  });

  // 🔑 After create hook
  Booking.afterCreate(async (booking) => {
    booking.bookingNumber = booking.id; // use the auto-increment ID
    await booking.save();
  });

  return Booking;
};

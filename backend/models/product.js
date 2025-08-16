'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
      Product.hasMany(models.CartItem, { foreignKey: 'productId' });
      Product.hasMany(models.InvoiceItem, { foreignKey: 'productId' });
      Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
      Product.hasMany(models.BookingItem, { foreignKey: 'productId', as: 'bookingItems' });
    }
  }

  Product.getProductWithImage = async function (productId) {
    const product = await this.findOne({
      where: { id: productId },
      include: [
        {
          model: sequelize.models.ProductImage,
          as: "images",
          attributes: ["url"],
          where: { isPrimary: true }, // only primary image
          required: false, // in case no image exists
        },
      ],
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images.length > 0 ? product.images[0].url : null,
    };
  };

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
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    category: {
      type: DataTypes.ENUM(
        'Wall-Mounted',
        'Island',
        'Built-In',
        'Downdraft',
        'Ceiling-Mounted'
      ),
      allowNull: false,
      defaultValue: 'Wall-Mounted'
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};

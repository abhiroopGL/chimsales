'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'featured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('Products', 'category', {
      type: Sequelize.ENUM(
        'Wall-Mounted',
        'Island',
        'Built-In',
        'Downdraft',
        'Ceiling-Mounted'
      ),
      allowNull: false,
      defaultValue: 'Wall-Mounted'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'featured');
    await queryInterface.removeColumn('Products', 'category');

    // Drop ENUM type (Postgres-specific cleanup)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Products_category";');
  }
};

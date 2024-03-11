'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tickets', 'service_sub', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'subservices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    await queryInterface.addColumn('histories', 'service_sub', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'subservices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tickets', 'service_sub');
    await queryInterface.removeColumn('histories', 'service_sub');
  }
};

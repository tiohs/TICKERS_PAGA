'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.addColumn('services', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('services', 'status');
  }
};

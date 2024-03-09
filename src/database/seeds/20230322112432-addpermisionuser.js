'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Administrador',
          email: 'admin@iacc.com',
          bi: '123456',
          password: bcrypt.hashSync('123456', 8),
          type: true,
          created_at: new Date(),
          updated_at: new Date()
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users');
  },
};

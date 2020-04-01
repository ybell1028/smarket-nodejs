'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'nickname', { 
        type: Sequelize.STRING(200),
        unique: true,
        allowNull: false 
      }),
      queryInterface.addColumn('users', 'phonenum',  { 
        type: Sequelize.STRING(200),
        allowNull: false 
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all ([
      queryInterface.removeColumn('users', 'nickname'),
      queryInterface.removeColumn('users', 'phonenum')
    ]);
  }
};

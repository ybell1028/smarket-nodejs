'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('bookmarks', 'list_name', 'folder_name');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('bookmarks', 'folder_name', 'list_name');
    }
};
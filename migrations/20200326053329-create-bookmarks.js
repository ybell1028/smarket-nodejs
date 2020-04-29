'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('bookmarks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            folder_name: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            item_id: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            item_title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_type: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('bookmarks');
    }
};
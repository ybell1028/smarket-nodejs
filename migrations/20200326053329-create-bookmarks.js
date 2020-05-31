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
                type: Sequelize.STRING,
                allowNull: false
            },
            item_selling: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            item_alarm: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            item_title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_link: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_image: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_lprice: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_mallname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            item_brand: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_maker: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_category1: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_category2: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_category3: {
                type: Sequelize.STRING,
                allowNull: true
            },
            item_category4: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('bookmarks');
    }
};
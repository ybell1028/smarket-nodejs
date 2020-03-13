var mysql = require('mysql');

module.exports = function () {
    return {
        init: function () {
            return mysql.createPool({
                connectionLimit: 10,
                host: 'localhost',
                user: 'root',
                password: '1028',
                database: 'android',
                debug: false
            });
        }
    }
};

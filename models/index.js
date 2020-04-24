'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

var sequelize = new Sequelize(
  'android', // 데이터베이스 이름
  'root', // 유저네임
  '1028', // 유저 패스워드
  {
    host: 'localhost',      // 호스트
    dialect: 'mysql',    // DB종류
    pool: {                 // connection pool
      max: 10,
      min: 0,
      idle: 10000
    }
  }
);
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
  //반복문을 돌면서 import를 통해 현재 폴더 내의 모든 파일들을 불러오고 있음.
  //import 메서드는 파일에 있는 Model 정의들과 완벽히 같은 object를 생성합니다.
  //따라서 models 폴더 내에 Model을 정의하면, 반복문을 돌면서 Model들을 취합합니다.
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

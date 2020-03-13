'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
    freezeTableName: true, //모델에 대한 테이블명을 모델명 그대로 사용하도록 합니다.
    timestamps: true,
    // 이 옵션이 활성화되면 자동으로 createdAt열과 updatedAt열을 생성하고 데이터가 생성되었을 때와 
    // 수정되었을 때에 자동으로 갱신됩니다. 만약 false로 지정하면 이 열을 생성하지 않습니다. 기본값은 true입니다.
    tableName: "users"
  });
  return user;
}
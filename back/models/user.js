module.exports = (sequelize, DataTypes) => {
  // mysql의 테이블 = sequelize의 model
  // define 파라미터인 User가 model 이름
  //  - MySQL에는 users(복수) 데이터가 생성됨
  const User = sequelize.define('User', {
    // id: {},  // MySQL에서 자동으로 넣어줌
    email: {
      // string, text, boolean, integer, float, datetime
      type: DataTypes.STRING(30), 
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      // 비밀번호는 암호화를 하기때문에 100까지 제한
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  };
  return User;
};
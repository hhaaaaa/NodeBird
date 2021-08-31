module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('Hashtag', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // 이모티콘도 가능해짐
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  Hashtag.associate = (db) => {
    // PostHashtag 라는 중간 테이블이 생김 (매핑테이블)
    //  - 두 번째 파라미터 {through: 이름}으로 이름 정해줄 수 있음
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  };
  return Hashtag;
};
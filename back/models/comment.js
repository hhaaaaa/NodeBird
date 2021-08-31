module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // associate - belongsTo의 역할
    // : 해당 테이블의 id를 만들어줌?
    // 아래와 같은 경우 UserId, PostId
  }, {
    charset: 'utf8mb4', // 이모티콘도 가능해짐
    collate: 'utf8mb4_general_ci', // 한글 저장
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
// 최신 문법 아래와 같이 변경됨! -> 나머지도 아래와 같이 수정하는게 좋음!
// const DataTypes = require('sequelize');
// const { Model } = DataTypes;

// module.exports = class Comment extends Model {
//   static init(sequelize) {
//     return super.init({
//       content: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//       },
//       // associate - belongsTo의 역할
//       // : 해당 테이블의 id를 만들어줌?
//       // 아래와 같은 경우 UserId, PostId
//     }, {
//       modelName: 'Comment',
//       tableName: 'comments',
//       charset: 'utf8mb4', // 이모티콘도 가능해짐
//       collate: 'utf8mb4_general_ci', // 한글 저장
//       sequelize,
//     });
//   }

//   static associate(db) {
//     db.Comment.belongsTo(db.User);
//     db.Comment.belongsTo(db.Post);
//   }
// };
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
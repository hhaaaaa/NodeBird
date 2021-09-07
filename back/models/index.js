const Sequelize = require('sequelize');
// const comment = require('./comment'); // 최신 문법으로 교체

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// sequelize가 node와 mysql을 연결해줌
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// db.Comment = comment; // 최신 문법으로 교체
db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
// 신고 위한 테이블 하나 만들어줘야함!

// Object.keys(db).forEach(modelName => { // 최신 문법으로 교체
//   db[modelName].init(sequelize);
// });

// 반복문 돌면 associate 의 관계들 연결해주는 곳
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Sequelize에 model들을 등록 완료!

module.exports = db;

const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

// app.js에서 실행 (passportConfig 실행 )
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 로그인 이후 다음 요청부터 매번 실행됨
  //  - id로부터 사용자 정보를 복구해냄 (DB를 통해)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ 
        where: { id: id },
        // include: [{ model: Post }],
      });
      done(null, user); // req.user에 넣어줌
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  // /passport/local.js exports 부분 실행
  local();
}
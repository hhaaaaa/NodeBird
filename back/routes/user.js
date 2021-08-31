const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 미들웨어 확장 (express 기법 중 하나)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(error);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    // 이 부분의 user가 index.js의 serializeuser()로 들어감
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // 비밀번호 제외(프론트에서 필요없음) 
      // post, follower, following 포함 시키기 위함
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // 원하는 컬럼만 받기
        attributes: { exclude: ['password'] },
        // 관계 포함
        include: [
          { model: Post },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {  // POST /user/
  try {
    // 이메일 중복체크
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용 중인 아이디 입니다.');
    }

    // 두 번째 파라미터 보통 10~13
    //  - 높을수록 보안성이 높음 (속도가 느려질 수 있음)
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(200).send('OK');
  } catch (error) {
    console.error(error);
    next(error);  // status(500)
  }
});

// 로그인 이후 deserializeUser()를 통해 req.user로 사용자 정보 가져올 수 있음

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

module.exports = router;
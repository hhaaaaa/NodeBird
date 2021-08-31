exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // next() 내부에 뭐라도 있으면, 에러 처리
    //             비어있다면, 다음 미들웨어로 이동
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // next() 내부에 뭐라도 있으면, 에러 처리 미들웨어로 이동 (내부적으로 존재, custom 가능(app.js 끝 부분))
    //             비어있다면, 다음 미들웨어로 이동
    next();
  } else {
    res.status(401).send('로그인 하지 않은 사용자만 접근 가능합니다.');
  }
};
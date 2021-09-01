// const http = require('http');
// const server = http.createServer((req, res) => {
//   console.log(req.url, req.method);

//   if (req.method === 'GET') {
//     if (req.url === '/api/posts') {}
//   } else if (req.method === 'POST') {
//     if (req.url === '/api/post') {}
//   } else if (req.method === 'DELETE') {
//     if (req.url === '/api/post') {}
//   }
  
//   res.write('<h1>Hello1</h1>');
//   res.write('<h2>Hello2</h2>');
//   res.write('<h3>Hello3</h3>');
  
//   res.end('<h4>Hello node</h4>');
// });
// // 3065 포트를 사용할것임!
// server.listen(3065, () => {
//   console.log('서버 실행 중..');
// });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(cors({
  // origin: '*',
  // 보낸 곳의 주소가 자동으로 들어가 편리함! (또는 http://localhost:3060)
  origin: true, 
  credentials: true,
}));
// 프론트에서 보낸 데이터를 사용할 수 있도록 하는 코드
//  - 위치가 꼭 이 곳이어야 함!!
//  - router보다 선행되도록!
//  - use() 내부에 들어가는 것들이 미들웨어!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 쿠키 및 세션 설정
app.use(cookieParser('nodebirdsecret'));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

// post.js 폴더로 이동해서 코드 간결하게
//  /post prefix를 줌
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

// 에러 처리 미들웨어 custom 가능
// app.use((err, req, res, next) => {

// });

app.listen(3065, () => {
  console.log('서버 실행 중...');
});


/* 
  @@@ 백엔드서버: 3065 @@@
  @@@ MySQL: 3306 @@@
  @ brew 통한 mysql 실행: mysql -h localhost -u root -p @

  ### Back-End ###
  1. back/app.js 생성
  2. npm init으로 package.json 만들기
  3. node app.js로 실행
    - 코드 수정을 했으면, 서버를 껐다가 다시 켜야함
  4. Express 사용
    - 기본 node http보다 코드를 깔끔하고 구조적으로 사용할 수 있는 Express 사용
    - [설치] npm i express
    - 내부적으로 http를 사용함
  5. 필요 라이브러리 설치
    - [설치] npm i sequelize sequelize-cli mysql2
    - mysql2: node와 mysql과 연결해주는 드라이버
    
    - npx sequelize init
      - config, migrations, models 폴더 생김
      - config.json 수정
      - models/index.js 수정
  6. models 생성
    1) sequelize에서 model들 등록
      - 필요한 model(table)과 index.js 작성
    2) express에서 sequelize 등록
      - app.js에 db.sequelize.sync() 작성
  7. 서버 실행 전에 명령어 실행
    - npx sequelize db:create
  8. 수정 사항 반영 자동화
    - nodemon 설치
    - [설치] npm i -D nodemon@2
    - package.json에 scripts 부분 수정
    - npm run dev로 실행
    - 코드 수정하면 알아서 재실행해줌!
  9. 비밀번호 암호화 라이브러리 설치
    - [설치] npm i bcrypt
  10. CORS 문제 해결
    - 브라우저에서 다른 도메인으로 요청을 보낼때 브라우저가 차단하는 문제
    - 서버에서 서버로 요청을 보낼땐 CORS 문제가 생기지 않는다!

    - Proxy 방식 사용
      - 위의 성질을 이용해 CORS 문제 해결
      - 브라우저 -> 프론트서버 -> 백엔드서버 -> 프론트서버 -> 브라우저

      [방법1] res.setHeader('Access-Control-Allow-Origin', '*'); 입력
        - 필요한 각 model에 작성해줘야함
      [방법2] npm i cors 설치 후 미들웨어 사용, app.js에 app.use(cors());
        - 모든 요청에 다 [방법1]로 헤더 설정
  11. 로그인 관련 다양한 방식 관리
    - [설치] npm i passport passport-local
    - passport-local: email+password / id+password로 로그인할 수 있게 도와줌
  12. 쿠키 및 세션과 전체적인 로그인 흐름
    - [설치] npm i express-session cookie-parser

    - 쿠키: 프론트에서는 로그인 관련 데이터를 랜덤한 문자열을 가지고 있음 
           보안 위협 최소화
    - 세션: 서버쪽에서는 로그인 관련 데이터를 통째로 들고있음
           모두 가지고있기 무거움! 
            -> passport에서 쿠키&ID만 가지고 있기로 결정!
  13. dotenv 사용
    - 배포된 소스코드 혹은 해킹의 위협에서 보안 유지하기 위함
    - [설치] npm i dotenv

    - back/.env 파일 생성
      - SECRET_NAME=VALUE 로 저장
    - app.js에 코드 추가
      1) const dotenv = require('dotenv');
      2) dotenv.config();
      3) process.env.SECRET_NAME 으로 가져와 사용
      4) 확장자가 json이면 사용할 수 없음
        -> config.json => config.js로 수정
      5) Git에도 올리면 안되는 파일!
  14. 미들웨어 사용
    - 미들웨어: app.use() 내부 또는 라우터 내부 콜백함수
    - 파라미터로 req, res, next를 갖지만, 직접 만들 수도 있음

    - 로그인&로그아웃 검사 용 routes/middlewares.js 파일 생성
  15. 쿠키 공유하기
    - 도메인이 다를때 cors문제가 생겨 해당 부분을 해결했음
      - Access-Control-Allow-Origin
      - app.use() 내부에 origin: '*' 작성
    - 도메인이 다르면 쿠키도 전달이 되지 않는다!!
      - Access-Control-Allow-Credentials
      1) app.use() 내부에 credentials: true 작성
      2) saga의 axios 세 번째 인자로, { withCredentials: true } 작성!
        - 2)는 코드 중복이 일어남!
        => saga/index.js에 axios.defaults.withCredentials = true; 작성
      3) Access-Control-Allow-Origin을 * 대신 명시해주기!
        - app.use() 내부 origin에 허용할 도메인 
                                또는 true 작성 (보안에는 좋지 않음)
  16. 서버에 요청/응답 기록
    - [설치] npm i morgan
*/
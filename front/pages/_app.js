import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css'; // 모든 페이지들에서 사용되는 antd의 css

import wrapper from '../store/configureStore';

// Component는 각 페이지들의 return 부분 : 각 페이지들의 부모인 셈!
const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};
NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};
export default wrapper.withRedux(NodeBird);

/* 
  궁금증 해결
  1. 시퀄라이즈, 맨 앞글자 대문자 표기?
*/

/*
  ### Next 설치 및 화면 디자인 ###
  1. Node 및 Npm 설치 확인


  2. npm init -> package명 입력 후 다른 요소들은 엔터로 패스


  3. Next 설치
    - npm I next@9 : 9버전 next 설치
    - node_modules 폴더 / package-lock.json 파일이 생김

    - 별도로 webpack 설정을 해주지 않음! (내부적으로 되어있음)
      - 코드 변경하면 빌드를 알아서 해줌 (react hot loader의 기능이 자동으로!)
    - 개발모드일 때는, 첫 빌드 시 속도가 조금 느림
      - 배포 위한 production 모드에서는 이런 걱정하지 않아도 됨!


  4. React / react-dom 설치
    - npm i react react-dom


  5. package.json 수정
    - dependencies에 next 정보 확인
    - scripts 수정
      “dev”: “next"
        - "next -p 3060"으로 작성하면, 3060 포트로 접속 가능해짐!
      => npm run dev 로 실행 가능!!!
    - author에 자신을 표시할 수 있는 이름 넣기


  6. Pages 폴더 생성
    - pages 폴더
      - 폴더명이 정해져있음!
        - Next가 pages 폴더를 인식해, 내부의 파일들을 개별적인 page로 만들어줌 
          (코드 스플리팅된 컴포넌트로 만들어줌)
      - page 라우팅까지 처리해줌!
        - pages/index.js: /
        - pages/about/hha.js: /about/hha
        - 동적 라우팅도 가능: [name].js 와 같은 형식

    1) index.js 생성: ‘주소/‘ 와 같은 형식이 index!!!
    2) 필요한 페이지 생성: profile.js, signup.js 등
      - 서버를 실행한 후에 pages 폴더 내부에 새로운 파일들을 만들 경우, Next가 인식을 못하는 경우가 있음
        => 서버를 껏다 켜기!


  7. Components 폴더 생성
    - 페이지가 아닌 컴포넌트를 위한 폴더
    - 폴더명은 정해져있지 않지만, 보통 components?)


  8. Link 사용
    - 자체적인 Router 사용 (react-router 사용하지 않는다)
    - import Link from ‘next/link’;
    - <Link href=“/{주소}”><a>{이름}</a></Link>
      - href를 a태그에 붙이지 않고, Link에 붙여줌!


  9. Eslint 설치
    - npm i eslint -D (-D : 개발용 설치)
    - npm i eslint-plugin-import -D
    - npm i eslint-plugin-react -D
    - npm i eslint-plugin-react-hooks -D
    - npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks

    => 설정을 위한 .eslintrc 파일 생성 (세팅은 파일 참고)


  10. _app.js 파일
    - pages 폴더 내 페이지들의 공통 설정을 위한 파일 (공통된 것들을 분리)


  11. Head 컴포넌트
    - Next에서 <head> 태그를 수정할 수 있도록 컴포넌트 제공
    - charset, title 등 변경 가능
    - import Head from 'next/head';


  12. Styled-components 적용
    - [설치] npm I styled-components

    - createGlobalStyle``;
      - 이미 정해져있는 class의 style을 수정 및 추가하고 싶을 때 사용!
      - return 부분 아무데나 넣어주면 된다!


  13. 리렌더링의 이해
    - 리렌더링 ?
      - 함수 내부가 다시 실행되는 것은 맞지만,
      - 바뀌는 부분만 다시 그려주는 것!

    - inline-style을 사용하면 안 됨!!!
      - {} === {} : false
      - React는 Virtual DOM으로 검사를 하면서 어디가 달라졌는지 확인 
        -> inline-style로 코딩 시, 해당 부분이 달라졌다고 생각해서 매 번 리렌더링 함!!
      => Styled-Components 사용!


  14. 크롬 확장프로그램 다운로드
    - React DevTools
    - Redux DevTools 


  15. 커스텀 훅 사용
    - hooks 폴더 생성 -> use[파일명].js 생성 후 커스텀 훅 제작
  

  ### Redux 설치 및 적용 ###
  1. next-redux-wrapper
    - Next에 Redux 붙이는 것을 간편하게 해주는 라이브러리

    - 일반 Redux를 붙이는 과정과 다름!
    - next-redux-wrapper가 없다면 Redux가 SSR 되지 않음!
      => 서버에서 데이터가 없이 화면만 그려줌 -> SSR하는 의미가 없어짐

    - [설치] npm i next-redux-wrapper (강의에서는 버전6 설치)
      - createWrapper, HYDRATE 사용
      - HYDRATE: next-redux-wrapper를 쓸 때 필요한 action
                 서버 쪽에서 실행된 Redux의 결과물이 프론트에서는 HYDRATE라는 actions 이름 아래에 데이터로 전달됨!
                 Redux SSR을 위해 필요한 것

    - store 폴더 내부에 configureStore.js 생성
      - createStore() 사용
    - _app.js에 wrapper.withRedux() HOC로 감싸줌


  2. Redux 설치와 필요성
    - [설치] npm i redux

    - react-redux에서는 <Provider store={store}>로 감싸줌!
      BUT) Next 6버전 이상에서는 알아서 Provider로 감싸주기 때문에,
           오히려 써주면 문제가 발생함!!!

    - 왜 Redux 사용?
      - 화면을 비즈니스 로직과 분리하기 위함!
        - 컴포넌트: 데이터를 부모 혹은 훅으로부터 받아옴
        - 중앙데이터저장소: 데이터 관리 
          - 데이터 양이 방대해지면 적절히 쪼개주는 작업이 필요함
          => Redux는 Reducer를 여러 개로 쪼갤 수 있음 (6. Reducer 쪼개기)
      - MobX는 코드량은 줄지만 추적이 어려움 (적응이 된 후 사용 권장)
      - ContextAPI는 비동기 처리를 위해 컴포넌트에서 useEffect() 사용
        - 컴포넌트는 화면 그리는 것에만 집중하는게 좋음!
        - 데이터를 다루는 것은 컴포넌트의 역할이 아님 (개인차가 있지만!)
        - 데이터 요청은 별도의 모듈 혹은 라이브러리가 하는 것이 좋음!
        - useEffect()를 컴포넌트 밖으로 꺼낼 수 있지만, 그렇게 되면 Redux나 MobX의 모양이 나옴!
        => 결국 처음부터 Redux 혹은 MobX를 사용하는게 낫다


  3. Redux
    - 화면을 비즈니스 로직과 분리: 데이터는 중앙 데이터 저장소에서 관리!
    - Reduce에서 이름을 따온것
    - useState 쓸 일이 많이 줄어든다!

    - [원리] 
      - action 만들어서 dispatch 해주면 reducer에 따라 다음 상태가 나옴
      - 이전상태와 비교했을때 바뀌었으면 알아서 연결된 컴포넌트들에 데이터를 뿌려줌

    1) 중앙데이터저장소에 데이터 세팅 (initialState)
      - 각 컴포넌트에서 데이터 조회 및 수정 가능
    2) action 생성 : {type: 'ACTION_NAME', data: '데이터'}
      - history를 기록하기 위함
      - 동적 액션 / action creator
        - action을 만들어주는 함수를 만듦!
        - 모든 data에 대비해 함수를 만들어 놓을 수 없으므로!
    3) action을 dispatch 해서 저장소 데이터 수정 시도
      - {type, data}가 reducer로 전달됨!
    4) reducer의 switch문을 통해 해당 action이 어떤 type인지에 따라 state 수정
      - reducer: (이전상태, 액션) => 다음상태
      - 항상 새로운 객체를 return하는 이유? ( { ...STATE_NAME, name: action.data } )
        - 불변성!
        - 객체를 새로 만들어야 변경 사항이 추적됨!
          - history에서 이전 데이터를 참조하기 위함
      - 비구조화 할당을 이용해 return하는 이유?
        - 데이터 절약
          - 변경되지 않는 부분은 참조 관계 유지(비구조화 할당)
          - 매 번 객체를 생성해야할 수도 있음(어떠한 key의 value가 객체 혹은 배열일 경우)

    - 새로운 action에 따라 reducer 내용도 추가됨 -> 코드량이 많아짐! (action creator & switch문)
      => 그럼에도 1) actions 하나 하나가 Redux에 기록돼서 좋다!! (데이터가 어떻게 바뀌어왔는지 추적 가능)
                2) Redux DevTools(타임머신)을 통해 데이터를 뒤로 혹은 앞으로 돌려가며 확인 가능!
                  - 버그 추적, 테스트에 좋음!
    - 개발모드일때는 history가 계속 유지됨(메모리 정리가 안 됨)
      배포모드일때는 history 보는 기능이 필요 없어서, 메모리 정리를 계속 해줌


  4. Redux 구현
    1) reducers 폴더 생성 & index.js 생성
      - reducer: store 내부에 initlaiState와, action이 dispatch 됐을 때 state를 어떻게 바꿀지 적어놓은 파일
        - 데이터를 가공!
        - store에 연결될 때 초기화됨!
        - initialState와 이를 어떻게 바꿀지 적어놓는 구조
        - 실제 컴포넌트에서는 reducer에 적혀있는 action을 dispatch하면 된다!
      - initialState 정의
      - action creator 정의
        - 데이터만 담음!
      - rootReducer() 정의
    2) store/configureStore에서 reducer를 import 해옴
      - store: Redux 전체!
        - 중앙데이터저장소(state?) + Reducer
      - store를 컴포넌트에서 가져다 쓸 수 있음
    3) npm i react-redux
      - useSelector() / useDispatch() 사용 위해 설치
      - state가 필요한 컴포넌트에서 import 해와서 사용
        - const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
          또는 const { isLoggedIn } = useSelector((state) => state.user);
          - useSelector() 내부에서 Redux store를 참조하고 있음 -> 위 처럼 가져와서 state 사용 가능!
          - isLoggedIn이 initialState.user.isLoggedIn 구조이기 때문에 위와 같이 선언!
          - isLoggedIn이 바뀌면 해당 컴포넌트가 리렌더링 됨!!!!
        - const dispatch = useDispatch();
          dispatch(logoutAction());  // 이와 같이 action creator를 dispatch해서 사용


  5. 미들웨어와 Redux DevTools
    1) 미들웨어
      - action이 reducer로 전달되기 전후로 추가 작업을 실행해주는 함수
        - action이 dispatch 될 때마다 일을 하는놈!
      - reducer에서 dispatch 된 action을 처리하기 전에 다른 일을 하고자 미들웨어를 사용!
        - reducer는 무조건 동기 작업만 수행 가능
        - 비동기 작업을 수행하기 위해 thunk, saga와 같은 미들웨어를 action과 reducer 사이에 끼워넣는것!!
      - action의 history를 확인하기 위해 Redux DevTools를 사용하려면 미들웨어를 붙여야함!

      - store에 enhancer 추가
        - Redux의 기능을 확장: enhancer
        - 개발모드 / 배포모드 둘의 enhancer가 상이함
          : history가 쌓이면 메모리도 많이 차지하고, 중앙데이터들이 어떻게 변하는지 보이기 때문에 보안에 취약할 수 있음
            (개발모드일 때만 DevTools 연결)
        - 개발모드를 위해 redux-devtools-extension 설치
          : [설치] npm i redux-devtools-extension)
        
        import { applyMiddleware, compose, createStore } from 'redux';
        import { composeWithDevTools } from 'redux-devtools-extension';
        const middlewares = [];  // 미리 공간을 만들어놓은 것! 나중에 saga 혹은 thunk를 사용할 때, []를 채우게 됨!
        const enhancer = process.env.NODE_ENV === 'production'
          ? compose(applyMiddleware(...middlewares))
          : composeWithDevTools(applyMiddleware(...middlewares));
    2) Redux DevTools
      - Diff    : 변경된 state들의 정보를 확인 가능
      - State   : 모든 state값 확인 가능
      - Jump    : 과거 및 최신 action의 상태로 돌아갈 수 있음


  6. Reducer 쪼개기
    1) reducers 폴더 내부에 js파일 생성
    2) 쪼개기 전 index.js의 initialState를 참조해, 각 파일에 initialState 생성
    3) 쪼갠 reducer들의 initialState는 index.js에서 합칠 수 있도록 export
      ex) 예제에서는 initialState 내부에 user, post가 있기 때문에 user.js & post.js 생성
        - BEFORE : [index.js] initialState = { user: {...USER_STATE}, post: {...POST_STATE} }
        - AFTER  : [index.js] initialState = { user: {}, post: {} }
                    [user.js] export initialState = { ...USER_STATE }
                    [post.js] export initialState = { ...POST_STATE }
    4) index.js 내부의 action creator & reducer의 case문을 매칭되는 파일로 이동시킴
      - case문 이동 시, initialState의 depth를 고려해서 수정할 것!
    5) 쪼개진 reducer들 합치기
      [1] index.js에 쪼갠 reducer들 import 해오기 (쪼갠reducer1, 쪼갠reducer2)
      [2] index.js rootReducer에 combineReducers()
        - import { combineReducers } from 'redux';
        - reducer는 함수! -> 함수를 합치는 일은 쉬운게 아님 -> combineReducers의 도움을 받음
          - [최초]
              initialState = { 쪼갤reducer1: {}, 쪼갤reducer2: {} }
          - [최종]
              combineReducers({
                index: (state = {}, action) => {     // HYDRATE(Redux SSR 위한)를 위한 index reducer 추가
                  switch문
                },
                쪼갠reducer1,                         // 최초 initialState와 같은 형식으로
                쪼갠reducer2
              })
              => reducers/index.js에 initialState가 필요없어짐! (알아서 reducer들의 initialState를 합쳐줌?)


  7. 이미지 캐루셀 구현
    - [설치] npm i react-slick


  8. 컴포넌트 폴더 구조
    - [원래] components 폴더 내부에 NAME.js 파일을 바로 생성해서 사용
        ex) components/ImageZoom.js
    - [권장] components 폴더 내부에 NAME 폴더 생성
        ex) components/ImageZoom/index.js & styles.js
              - index.js: 필요한, 중요한 기능들
              - 이외.js: styled-components 정의와 같은 곁다리 코드들 정리
                - styles.js와 같이 분리하면, 코드 수가 줄어든다!!
                - styled-components를 export해서 사용하면, 다른 컴포넌트에서 재사용할 수 있음!


  9. Redux-thunk (실무에서는 대부분 saga 사용?)
    - Redux의 미들웨어: Redux의 기능을 향상(확장)시켜주는 역할
    - Redux가 비동기 action을 dispatch 할 수 있도록 도와주는 역할
      - 하나의 action에서 dispatch를 여러 번 할 수 있음
      - 하나의 비동기 action 안에 여러 개의 동기 action을 넣을 수 있음
        - axios 요청에 requestAction, successAction, failureAction 등 여러 개의 동기 action을 dispatch 가능
    
    - [설치] npm i redux-thunk
    - configureStore.js 수정
      - thunkMiddleware import 해오기
      - middlewares 배열에 thunkMiddleware 넣기

    - thunk에서 착안해 custom middleware를 쉽게 만들 수 있음!
      - 화살표 3개 (3단 고차함수)
        - (store) => (next) => (action) : action 실행 시 각 파라미터들은 자동으로 넣어짐!
        - next: 다음 미들웨어를 호출하는 역할! (다음 미들웨어가 없다면 dispatch 됨)
        - action: dispatch 된 action
      - 인자가 정해져 있어서, 해당 파라미터들을 갖고 자유롭게 custom 가능
      - action은 원래 객체인데, thunk에서는 action을 function으로 둘 수 있다
      - action이 function인 경우는, 해당 함수가 지연 함수이기 때문에 그 action을 나중에 실행할 수 있다!
      => Redux DevTool을 대체하는 미들웨어 정의 가능!

    - thunk 사용 시, 함수를 return하는 async action creator가 추가됨
    - delay 등 나머지 모든 것들을 직접 구현해줘야함!
    - throttle & debounce(셀프DoS공격 방지 위해 초 당 action개수 정하기), takelatest(여러 이벤트 중 마지막 이벤트만요청) 등 
      기능을 사용하기 위해 thunk 보다는 saga를 많이 이용함!


  10. Redux-saga
    - saga 사용을 위해 thunk 삭제: npm rm redux-thunk
    - [설치] npm i redux-saga

    0) generator에 대한 이해
      - 특별한 역할을 하는 함수
      - const gen = function*() {} 의 형태
        - gen() 실행 시 변화 x
        - gen().next() 실행 시 내부의 것들이 실행됨
      - const gen = function* () {
          console.log(1);
          yield;
          console.log(2);
          yield;
          console.log(3);
          yield 4;
        }
          - gen().next() 1번째 실행: 1 / {value: undefined, done: false}
          - gen().next() 2번째 실행: 2 / {value: undefined, done: false}
          - gen().next() 3번째 실행: 3 / {value: 4, done: false}
          - gen().next() 4번째 실행: [결과없음] / {value: undefined, done: true}
      - 중단점이 있는 함수! (yield 가 있는 곳에서 멈춤)
        : next()를 통해 yield가 있는 곳까지 실행하고, done:true가 되면 함수가 종료?
      - generator 함수 내부에 무한루프 코드를 적어도, yield가 있다면 매 번 중단됨!
        => 해당 성질을 이용해 saga의 특정 기능 혹은 이벤트리스너와 같은 기능 구현 가능!

    1) configureStore.js 수정
      - import 해오기
        - import createSagaMiddleware from 'redux-saga';
        - import rootSaga from '../sagas';
          : sagas/index.js 폴더 및 파일 생성
      - configureStore() 추가
        - const sagaMiddleware = createSagaMiddleware();
        - middlewares 배열에 추가
        - store.sagaTask = sagaMiddleware.run(rootSaga);

    2) sagas/index.js 생성 & saga-effects 설명
      - saga effects import 해오기
        - import { all, fork, take, call, put } from 'redux-saga/effects';
        - delay, debounce, throttle, takeLatest, takeEvery, takeLeading, takeMaybe 등 여러 effect들이 있음
        - effect들을 자유자재로 사용하기 위해서는 generator 원리에 대한 이해가 필요
        
        - effect 사용 시에는 앞에 yield를 붙여줌!
          - all: 배열을 받음, 배열 안의 것들을 한 방에 실행
          - fork: async 함수를 호출
          - call: sync 함수를 호출
            - yield call(logInAPI, action.data, 'a', 'b', 'c');     // fork()도 동일
              : logInAPI(action.data, a, b, c)를 호출하겠다
          - take: take('ACTION_NAME', GENERATE_FUNC)
            - ACTION_NAME이라는 action이 실행될때까지 기다리겠다
            - ACTION_NAME action이 실행되면, GENERATE_FUNC를 실행
              - GENERATE_FUNC에서 서버에서 받은 결과를 활용할 수 있음
            - ACTION_NAME이라는 action 자체가 GENERATE_FUNC의 파라미터로 전달이 됨!
            - 치명적인 단점: 1회용!!!!!!
              - takeEvery, takeLeading, takeLatest, throttle, debounce 시리즈가 있음!
          - put: dispatch로 생각하면 된다
          - delay: setTimeout과 같은 역할

      - export default function* rootSaga() {} 작성
        - 필요한 async action들을 작성해줌
        - thunk 에서는 직접 async action creator를 직접 실행했지만,
          saga 에서는 이벤트리스너 같은 역할을 함!

        @ 내가 이해한대로 정리 @
        [1] rootSaga() 내부에 dispatch된 action들을 지켜보고 실행하기 위한 effect들 호출
          - yield all([fork(watchLogIn), fork(), ...])
            - fork(): 이벤트리스너 역할을 하는 함수 호출 (fork: 비동기)
            - all(): 여러 개의 fork()를 한 방에 실행

        [2] 이벤트리스너 역할을 할 generator 함수 정의
          - take(): 첫 번째 파라미터인 action이 dispatch 될 때까지 기다렸다가, 
                    해당 action이 실행되면 두 번째 파라미터인 generator 함수 호출.
                    이 때, generator 함수의 파라미터로 첫 번째 파라미터 action이 전달됨!!
          - function* watchLogIn() {
              // (1) take
              yield take('LOG_IN_REQUEST', logIn);
            
              // (2) while-take
              while (true) {
                yield take('LOG_IN_REQUEST', logIn);
              }
              
              // (3) takeEvery, takeLatest, takeLeading
              yield takeLatest('LOG_IN_REQUEST', logIn);

              // (4) throttle
              yield throttle(2000, 'LOG_IN_REQUEST', logIn);
            } 
            (1) take는 1회용 -> 한 번 로그인,로그아웃 후엔 이벤트리스너가 사라져버림
            (2) while-take(동기)
              - 계속해서 yield 될 수 있도록 (진정한 이벤트리스너와 같이)
              - 직관적이지 않아서 많이 쓰이지 않음
            (3) takeEvery(비동기) : (2)와 동일하지만 비동기 처리
                takeLeading: 여러 번의 action 중 최초의 action만을 취하도록
                takeLatest: 여러 번의 action 중 마지막 action만을 취하도록 (실수로 2번 클릭했을 때)
                            이전 요청이 끝나기도 전에 다시 요청을 보낼 때 적용
                            모두 호출하고, 이전것이 완료되기 전에 다음것이 호출되면 이전것을 취소
                            실수로 버튼을 두 번 눌러 결과물이 화면에 두 번 나오는 일을 막고 싶은 경우 사용
                            (takeEvery와의 차이점: 여러 개의 action이 동시에 실행될 때만 차이가 있음)
              - 완료되지 않은 동작들에만 한정됨! (동시에 로딩중인 것들에서만 판단)
              - 프론트 서버에만 한정 
                ex) 동시에 두 번의 요청을 했을 때
                - 백엔드 서버로 요청은 두 번 전송
                - 프론트 서버로 응답을 한 번만 오도록 (응답 하나를 취소)
                - 단점: 백엔드 서버에는 요청 데이터가 2번 저장되긴함....
                  - 프론트에서 응답을 하나 취소했기 때문에 응답에 대한 데이터 한 번만 표시되지만,
                    새로고침 했을 때는 백엔드 서버에 요청이 두 번 남아있기 때문에 데이터가 두 번 표기됨!
                  => throttle 사용 
            (4) throttle
              - yield throttle(TIME, 'ACTION_NAME', GENERATOR_FUNC)
              - ACTION_NAME을 TIME 동안 1번만 실행하겠다!
              - 요청 보내는것 까지 시간 제한을 둬서, 그 안에 1번만 보내도록 설정할 수 있음!
                - BUT) 응답을 차단하는것! 이미 전송된 요청은 차단되지 않는다!
                  => 처음부터 요청을 보내지 않는게 가장 좋은 방법!
              - 특수한 경우에만 throttle을 사용하고, 보통은 takeLatest를 사용!
                - 혹시나 실수로 두 번 클릭해서 요청 시, 서버에서 검사해서 돌려주도록 설정하는게 좋다?

              *** throttle과 debounce ***
              - throttle: 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
                ex) 스크롤링에 많이 사용
              - debounce: 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음 함수)만 호출하도록 하는 것
                          호출되고 일정 시간이 지나야만 실제로 실행
                          시간이 지나기 전에 재호출되면 이전것이 취소
                ex) 반응형 검색에 많이 사용 (일정 단어가 완성되면 검색 결과 화면을 보여주고 싶은 경우)

        [3] 이벤트리스너에 걸린 action의 generator 콜백함수? 정의
          - [2]에서 파라미터로 전달받은 action 정보를 사용해
            - yield call(async-await와 비슷) 한 결과를 저장하고
            - 이를 put(새로운 action을 dispath) 하는데 활용
          - function* logIn(action) {
              try {
                const result = yield call(logInAPI, action.data);
                yield put({
                  type: 'LOG_IN_SUCCESS',
                  data: result.data
                });
              } catch (err) {
                yield put({
                  type: 'LOG_IN_FAILURE',
                  data: err.response.data
                });
              }
            }

        [4] [3]에서 put할 때 사용될 데이터를 가져오기 위한 call 내부 함수 정의
          - 얘는 generator가 아닌 일반 함수
          - function logInAPI(data) {
              return axios.post('/api/login', data);
            }

    3) saga 쪼개고, reducer와 연결
      [1] saga 쪼개기
        - index.js 코드가 길어짐! (action 하나 당 3개씩 세트)
        - reducer와 비슷한 기준으로 쪼개면 된다!
        - 각 기능에 맞게 쪼갠 파일로 코드 옮긴 후,
          index.js에서 import SAGA_NAME -> yield all 부분에 fork(SAGA_NAME) 해주면 됨!

      [2] reducer와 연결
        - 새로 수정된 saga에 맞게 reducer 및 component 수정

    4) action & state 정리
      - Reducer 파일에서 action명이 문자열로 되어있을 때, 오타에 취약함! 
        -> actino명들을 변수로 빼주고, action 호출 및 saga에서 사용 위해 export 해줌!!
           변수화 해준 코드가 길어지면, actions 파일로 따로 빼줘도 됨!

    5) 더미데이터 사용 시 유용한 라이브러리
      - shortid
        - 반복문에 쓰이는 key를 랜덤한 짧은 id로 갖고 싶을때 사용
        - [설치] npm i shortid
        - import 해온 후, shortId.generate()로 사용!
      - faker
        - [설치] npm i faker
        - 이미지는 사용하기 싫은데 칸 공백은 두고 싶을때?
          - plcaeholder.com 참고

    6) immer 도입
      - 불변성을 복잡하지 않게 지킬 수 있게 사용하는 라이브러리 (react에서도 사용 가능)
      - 개꿀템! 꼭 사용!!!
      - [설치] npm i immer
      
      [1] import produce from 'immer'; 로 불러와 사용!
      [2] reducer 메인 함수 내부에 produce 함수 return
        - 기본 외형
            return produce(state, (draft) => {

            });
          - state는 건들면 안됨! draft만 조작!
            - draft를 조작하면 state는 알아서 바뀜!
            - draft를 mutable하게 변경 -> 내부적으로 변경점을 immutable하게 state에 반영!

        - reducer란? 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수 (불변성은 지키면서!)
          - produce를 사용하면, '불변성은 지키면서'를 버려도됨!!!
          - draft는 불변성을 생각하지 않고 막 바꿔도됨 
            -> immer가 draft를 보고 불변성을 지키면서 알아서 다음 상태를 만들어줌!!!
          - 불변성을 지키기 위한 ...이 사라짐
            - draft.KEY_NAME = VALUE;
            - draft.KEY_NAME.unshift(VALUE);
              // unshif(): 새로운 요소를 배열의 맨 앞에 추가하고, 새로운 길이를 반환하는 JS 함수
          - 제거할땐 filter가 쓰기 더 편하기 때문에 그대로 filter 사용
            - 불변성을 지키지 않으려면 splice 쓰는게 맞음 (immer 규칙?)
          - immer 사용하면 switch문-default에 그냥 break;로 적기!

    7) 인피니티 스크롤링
      - react-virtualized
        - 화면에 디스플레이 될 개수가 한정적이라는 점을 이용해,
          화면엔 몇 개의 데이터만 화면에 그려주고, 나머지는 메모리에 저장해두는 기법!
        - PC에 비해 모바일은 메모리가 한정적이기 때문에, 해당 기법을 사용하는 경우가 있음!
        - instagram도 해당 기법을 사용함! (virtualized-list)
          - article 태그가 스크롤 함에 따라, 위 아래로 하나씩 사라지고 생성됨을 확인할 수 있음! 

        - 이 기법을 사용할 때는 내장된 infiniteloader를 사용해야! (docs 참조)

*/
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

// const initialState = {    // combineReducers의 사용으로 index.js에서 더 이상 필요 없음
//   user: {
//     // isLoggedIn: false, // user.js로 분리
//     // user: null,
//     // signUpData: {},
//     // loginData: {},
//   },
//   post: {
//     // mainPosts: [],     // post.js로 분리
//   }
// };

// action creator
// export const loginAction = (data) => {
//   return {
//     type: 'LOG_IN',
//     data, // data: data 와 동일 (키 값과 변수명이 같다면 생략 가능)
//   }
// };
// export const logoutAction = () => {
//   return {
//     type: 'LOG_OUT',
//   }
// };

// async action creator - Redux Saga 때 배우게 됨!

// (이전상태, 액션) => 다음상태
// - 이전상태와 액션을 바탕으로 다음상태를 만들어내는 함수!
// const rootReducer = ((state = initialState, action) => {
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      // case 'LOG_IN':
      //   return {
      //     ...state,
      //     user: {
      //       ...state.user,
      //       isLoggedIn: true,
      //       user: action.data,
      //     }
      //   };
      // case 'LOG_OUT':
      //   return {
      //     ...state,
      //     user: {
      //       ...state.user,
      //       isLoggedIn: false,
      //       user: null,
      //     }
      //   };
      default: // Reducer 초기화할 때, return 값이 undefined가 될 수 있기때문에 넣어줌!
        return state;
    }
  },
  user,
  post,
});
export default rootReducer;
import { all, delay, fork, put, takeLatest } from '@redux-saga/core/effects';
import axios from 'axios';
import { 
  LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, 
  LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS,
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, 
  FOLLOW_REQUEST, FOLLOW_SUCCESS, FOLLOW_FAILURE, 
  UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE,
} from '../reducers/user';

function followAPI(data) {
  return axios.post('/api/follow', data);
}
function* follow(action) { 
  try {
    yield delay(1000); // 실제 서버 요청으로 바꿀땐 주석, 아랫줄 주석 해제
    // const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: FOLLOW_FAILURE,
      error: error.response.data,
    });
  }
}

// commit
function unfollowAPI(data) {
  return axios.post('/api/unfollow', data);
}
function* unfollow(action) { 
  try {
    yield delay(1000); // 실제 서버 요청으로 바꿀땐 주석, 아랫줄 주석 해제
    // const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: error.response.data,
    });
  }
}

function loginAPI(data) {
  return axios.post('/api/login', data);
}
function* login(action) { 
  try {
    yield delay(1000); // 실제 서버 요청으로 바꿀땐 주석, 아랫줄 주석 해제
    // const result = yield call(loginAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      // data: result.data
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      error: error.response.data,
    });
  }
}

function logoutAPI() {
  return axios.post('/api/logout');
}
function* logout() {
  try {
    // const result = yield call(logoutAPI);
    yield delay(1000);
    yield put({
      type: LOG_OUT_SUCCESS,
      // data: result.data
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.response.data,
    });
  }
}

function signupAPI() {
  return axios.post('/api/signup');
}
function* signup() {
  try {
    // const result = yield call(signupAPI);
    yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
      // data: result.data
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}
function* watchLogin() {
  // yield take('LOG_IN_REQUEST', login);
  
  // while (true) {
  //   yield take('LOG_IN_REQUEST', login);
  // }

  // takeLatest, takeEvery, takeLeading
  yield takeLatest(LOG_IN_REQUEST, login);
}
function* watchLogout() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}
function* watchSignup() {
  yield takeLatest(SIGN_UP_REQUEST, signup);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignup),
  ]);
}
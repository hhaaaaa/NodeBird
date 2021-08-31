import { all, fork } from 'redux-saga/effects';

// saga 쪼갠 후 import 해오기
import postSaga from './post';
import userSaga from './user';

// logIn, logInAPI, logOutAPI 옮김 (userSaga)
// addPost, addPostAPI 옮김 (postSaga)

// watchLogIn, watchLogOut 옮김 (userSaga)
// watchPost 옮김 (postSaga)

export default function* rootSaga() {
  yield all([
    // fork(watchLogIn), fork(watchLogOut),
    fork(userSaga),
    // fork(watchAddPost),
    fork(postSaga),
  ]);
}
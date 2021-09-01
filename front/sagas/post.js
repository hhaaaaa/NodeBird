import { 
  all, call, fork, put, takeLatest, throttle, 
  // delay,
} from '@redux-saga/core/effects';
import axios from 'axios';
// import shortId from 'shortid';
import { 
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, 
  ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS, 
  LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
  REMOVE_POST_FAILURE, REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, 
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  // generateDummyPost,
} from '../reducers/post';
import { 
  ADD_POST_TO_ME, REMOVE_POST_OF_ME, 
} from '../reducers/user';

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: error.response.data,
    });
  }
}
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function loadPostsAPI(data) {
  return axios.get('/posts', data);
}
function* loadPosts(action) {
  try {
    // yield delay(1000);
    const result = yield call(loadPostsAPI, action.data);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      // data: generateDummyPost(10),
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: error.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/post', { content: data });
}
function* addPost(action) {
  try {
    // yield delay(1000);
    const result = yield call(addPostAPI, action.data);
    console.log(result);
    // const id = shortId.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      // data: {
      //   id,
      //   content: action.data,
      // },
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      // data: id,
      data: result.data.id,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchUnlikePost() {
  yield throttle(5000, UNLIKE_POST_REQUEST, unlikePost);
}
function* watchLikePost() {
  yield throttle(5000, LIKE_POST_REQUEST, likePost);
}
function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchUnlikePost),
    fork(watchLikePost),
    fork(watchAddPost),
    fork(watchLoadPosts),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
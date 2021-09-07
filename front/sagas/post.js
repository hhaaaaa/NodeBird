import { 
  all, call, fork, put, takeLatest, throttle, 
  // delay,
} from '@redux-saga/core/effects';
import axios from 'axios';
// import shortId from 'shortid';
import { 
  ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, 
  ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS, 
  LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
  LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
  REMOVE_POST_FAILURE, REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, 
  UPDATE_POST_REQUEST, UPDATE_POST_SUCCESS, UPDATE_POST_FAILURE,
  LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, 
  RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE,
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
    console.error(error);
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
    console.error(error);
    yield put({
      type: LIKE_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts(action) {
  try {
    // yield delay(1000);
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      // data: generateDummyPost(10),
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: error.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: error.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  // 한글을 get 요청에 보내면 에러! - 인코드 해줘야함
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: error.response.data,
    });
  }
}

function addPostAPI(data) {
  // return axios.post('/post', { content: data });
  return axios.post('/post', data); // FormData는 json 형식이면 안됨
}
function* addPost(action) {
  try {
    // yield delay(1000);
    const result = yield call(addPostAPI, action.data);
    // console.log(result);
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
    console.error(error);
    yield put({
      type: ADD_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
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
    console.error(error);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: error.response.data,
    });
  }
}

function updatePostAPI(data) {
  return axios.patch(`/post/${data.PostId}`, data);
}
function* updatePost(action) {
  try {
    const result = yield call(updatePostAPI, action.data);
    yield put({
      type: UPDATE_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPDATE_POST_FAILURE,
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

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}
function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: RETWEET_FAILURE,
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
function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}
function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}
function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}
function* watchUpdatePost() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePost);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchUnlikePost),
    fork(watchLikePost),
    fork(watchAddPost),
    fork(watchLoadPost),
    fork(watchLoadPosts),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchRemovePost),
    fork(watchUpdatePost),
    fork(watchAddComment),
    fork(watchUploadImages),
    fork(watchRetweet),
  ]);
}
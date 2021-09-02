import produce from 'immer';

export const initialState = {
  loadFollowersLoading: false, // 팔로워 불러오기 시도 중 (로딩창 용도)
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false, // 팔로잉 불러오기 시도 중 (로딩창 용도)
  loadFollowingsDone: false,
  loadFollowingsError: null,
  loadMyInfoLoading: false, // 내 로그인 정보 불러오기 시도 중 (로딩창 용도)
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false, // 로그인 유저 불러오기 시도 중 (로딩창 용도)
  loadUserDone: false,
  loadUserError: null,
  removeFollowerLoading: false, // 팔로워 제거 시도 중 (로딩창 용도)
  removeFollowerDone: false,
  removeFollowerError: null,
  followLoading: false, // 팔로우 시도 중 (로딩창 용도)
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔 시도 중 (로딩창 용도)
  unfollowDone: false,
  unfollowError: null,
  loginLoading: false, // 로그인 시도 중 (로딩창 용도)
  loginDone: false,
  loginError: null,
  logoutLoading: false, // 로그아웃 시도 중 (로딩창 용도)
  logoutDone: false,
  logoutError: null,
  signupLoading: false, // 회원가입 시도 중 (로딩창 용도)
  signupDone: false,
  signupError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도 중 (로딩창 용도)
  changeNicknameDone: false,
  changeNicknameError: null,
  me: null,
  signUpData: {},
  loginData: {},
};

// action creator

// async action creator
// thunk 사용 시, 함수를 return하는 async action creator가 추가됨
// export const loginAction = (data) => {
//   return (dispatch, getState) => {
//     const state = getState(); // initialState를 받아올 수 있음!

//     dispatch(loginRequestAction());
//     axios.post('/api/login')
//       .then((res) => {
//         dispatch(loginSuccessAction(res.data));
//       })
//       .catch((err) => {
//         dispatch(loginFailureAction(err));
//       });
//   }
// };

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

// const dummyUser = (data) => ({
//   ...data,
//   nickname: 'hha',
//   id: 1,
//   Posts: [{ id: 1 }],
//   Followings: [{ nickname: 'mma' }, { nickname: 'ssa' }, { nickname: 'dda' }],
//   Followers: [{ nickname: 'mma' }, { nickname: 'ssa' }, { nickname: 'dda' }],
// });

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data, // data: data 와 동일 (키 값과 변수명이 같다면 생략 가능)
  };
};
export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};
// saga가 알아서 action 호출 (put effect 사용) -> success, failure 액션 정의 필요 x

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_FOLLOWERS_REQUEST:
        draft.loadfollowersLoading = true;
        draft.loadfollowersDone = false;
        draft.loadfollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadfollowersLoading = false;
        draft.loadfollowersDone = true;
        draft.me.Followers = action.data;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadfollowersLoading = false;
        draft.loadfollowersError = action.error;
        break;
      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadfollowingsLoading = true;
        draft.loadfollowingsDone = false;
        draft.loadfollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadfollowingsrLoading = false;
        draft.loadfollowingsrDone = true;
        draft.me.Followings = action.data;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadfollowingsLoading = false;
        draft.loadfollowingsError = action.error;
        break;
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoError = null;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserError = null;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.userInfo = action.data;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;
      case REMOVE_FOLLOWER_REQUEST:
        draft.reomveFollowerLoading = true;
        draft.reomveFollowerDone = false;
        draft.reomveFollowerError = null;
        break;
      case REMOVE_FOLLOWER_SUCCESS:
        draft.removeFollowerLoading = false;
        draft.removeFollowerDone = true;
        draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId);
        break;
      case REMOVE_FOLLOWER_FAILURE:
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error;
        break;
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.data.UserId });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId);
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.loginLoading = true;
        draft.loginDone = false;
        draft.loginError = null;
        break;
      case LOG_IN_SUCCESS:
        // return {
        //   ...state,
        //   loginLoading: false,
        //   loginDone: true,
        //   // me: action.data,
        //   me: dummyUser(action.data), // 더미데이터
        // };
        draft.loginLoading = false;
        draft.loginDone = true;
        // draft.me = dummyUser(action.data);
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.loginLoading = false;
        draft.loginError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logoutLoading = true;
        draft.logoutDone = false;
        draft.logoutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.logoutLoading = false;
        draft.logoutDone = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logoutLoading = false;
        draft.logoutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signupLoading = true;
        draft.signupDone = false;
        draft.signupError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signupLoading = false;
        draft.signupDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signupLoading = false;
        draft.signupError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname;
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        // return {
        //   ...state,
        //   me: {
        //     ...state.me,
        //     Posts: [{ id: action.data }, ...state.me.Posts],
        //   },
        // };
        draft.me.Posts.unshift({ id: action.data });
        break;
      case REMOVE_POST_OF_ME:
        // return {
        //   ...state,
        //   me: {
        //     ...state.me,
        //     Posts: state.me.Posts.filter((v) => v.id !== action.data),
        //   },
        // };
        draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
        break;
      default:
        // return state;
        break;
    }
  });
};
export default reducer;
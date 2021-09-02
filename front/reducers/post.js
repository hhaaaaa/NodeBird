// import shortId from 'shortid';
import produce from 'immer';
// import faker from 'faker';

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

// export const generateDummyPost = (number) => Array(number).fill().map(() => ({
//   id: shortId.generate(),
//   User: {
//     id: shortId.generate(),
//     nickname: faker.name.findName(),
//   },
//   content: faker.lorem.paragraph(),
//   Images: [{
//     src: faker.image.image(),
//   }],
//   Comments: [{
//     User: {
//       id: shortId.generate(),
//       nickname: faker.name.findName(),
//     },
//     content: faker.lorem.sentence(),
//   }],
// }));

// type을 상수로 빼주면, Reducer에서 재활용해 오타 방지 가능
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';  
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';  
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';  

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';  
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';  
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';  

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';  
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';  
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';  

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';  
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';  
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';  

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';  
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';  
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';  

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';  
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';  
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';  

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';  
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';  
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';  

export const RETWEET_REQUEST = 'RETWEET_REQUEST';  
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';  
export const RETWEET_FAILURE = 'RETWEET_FAILURE';  

export const REMOVE_IMAGE = 'REMOVE_IMAGE';  

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

// const dummyPost = (data) => ({
//   id: data.id,
//   content: data.content,
//   User: { 
//     id: 1,
//     nickname: 'hha',
//   },
//   Images: [],
//   Comments: [],
// });
// const dummyComment = (data) => ({
//   id: shortId.generate(),
//   content: data,
//   User: { 
//     id: 1,
//     nickname: 'hha',
//   },
// });

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LIKE_POST_REQUEST:
        draft.likePostsLoading = true;
        draft.likePostsDone = false;
        draft.likePostsError = null;
        break;
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostsLoading = false;
        draft.likePostsDone = true;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostsLoading = false;
        draft.likePostsError = action.error;
        break;
      case UNLIKE_POST_REQUEST:
        draft.unlikePostsLoading = true;
        draft.unlikePostsDone = false;
        draft.unlikePostsError = null;
        break;
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unlikePostsLoading = false;
        draft.unlikePostsDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unlikePostsLoading = false;
        draft.unlikePostsError = action.error;
        break;
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.hasMorePosts = action.data.length === 10;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        // return {
        //   ...state,
        //   mainPosts: [dummyPost(action.data), ...state.mainPosts], // 앞에 추가해야 최신글이 위에 보임!
        //   addPostLoading: false,
        //   addPostDone: true,
        // }; // 불변성 지키기위한 코드가 immer를 사용하면 아래와 같이 간단해짐!
        draft.addPostLoading = false;
        draft.addPostDone = true;
        // draft.mainPosts.unshift(dummyPost(action.data));
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = [];
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        // 제거할땐 filter가 쓰기 더 편하기 때문에 그대로 filter 사용
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
        // const post = { ...state.mainPosts[postIndex] };
        // post.Comments = [dummyComment(action.data.content), ...post.Comments];
        // const mainPosts = [...state.mainPosts];
        // mainPosts[postIndex] = post;
        // return {
        //   ...state,
        //   mainPosts,
        //   addCommentLoading: false,
        //   addCommentDone: true,
        // };

        // mainPosts 중 내가 원하는 게시글 찾고 -> 맨 앞에 dummyComment 하나 넣기
        // 위에 비해 엄청 간단해짐......
        // const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        // post.Comments.unshift(dummyComment(action.data.content));
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS:
        draft.imagePaths = action.data;
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        break;
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;
      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;
      case RETWEET_SUCCESS:
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      case RETWEET_FAILURE:
        draft.retweetLoading = false;
        draft.retweetError = action.error;
        break;
      case REMOVE_IMAGE:
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
        break;
      default:
        // return state;
        break; // immer 쓸 땐 break;
    }
  });
};
export default reducer;
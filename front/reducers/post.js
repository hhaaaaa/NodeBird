import shortId from 'shortid';
import produce from 'immer';
import faker from 'faker';

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
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
};

export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortId.generate(),
  User: {
    id: shortId.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortId.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));

// type을 상수로 빼주면, Reducer에서 재활용해 오타 방지 가능
export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';  
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';  
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';  

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';  
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';  
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';  

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';  
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';  
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';  

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT _REQUEST';  
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';  
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';  


export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: { 
    id: 1,
    nickname: 'hha',
  },
  Images: [],
  Comments: [],
});
const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: { 
    id: 1,
    nickname: 'hha',
  },
});

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.hasMorePosts = draft.mainPosts.length < 50;
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = action.error;
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
        draft.mainPosts.unshift(dummyPost(action.data));
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostDone = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        // 제거할땐 filter가 쓰기 더 편하기 때문에 그대로 filter 사용
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostDone = action.error;
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
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentDone = action.error;
        break;
      default:
        // return state;
        break; // immer 쓸 땐 break;
    }
  });
};
export default reducer;
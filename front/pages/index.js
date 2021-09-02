import axios from 'axios';
import React, { useEffect } from 'react'; // Next.js 에서는 이 문장을 생략해도 상관없음
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { 
    mainPosts, hasMorePosts, loadPostsLoading, retweetError,
  } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // CSR일 때는, 이 부분 때문에 문제가 생김 (유저 정보/게시글 불러올때까지 데이터의 공백이 발생함)
  //  - getServerSideProps() 이용해 문제 해결
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight 
        > document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};
// Home 컴포넌트보다 먼저 실행됨
//  - getStaticProps와 같은 것을 넣어두면, Home 컴포넌트보다 먼저 실행이됨!
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  try {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    // 컴포넌트 화면을 그리기 전에, 서버쪽에서 먼저 실행을 함
    //  - context 내부에 store가 들어 있음
    //  - Redux에 데이터가 채워진 상태로 렌더링이 됨!
    // console.log(context);
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    // 두 개의 request에 대한 응답이 올 때까지 기다릴 장치가 필요! 
    context.store.dispatch(END);
    // store.sagaTask는 configureStore에서 등록해뒀음!
    await context.store.sagaTask.toPromise();
  
    // 여기까지 실행된 결과를 HYDRATE로 보내줌!
  } catch (error) {
    console.log(error);
    // console.error(error);
  }
});
export default Home;
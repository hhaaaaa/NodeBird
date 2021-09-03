// post/[id].js
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  // if (router.isFallback) {
  //   return <div>로딩중...</div>;
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname} 님의 글
        </title>
        <meta name="decription" content={singlePost.content} />
        <meta name="og:title" content={`${singlePost.User.nickname} 님의 게시글`} />
        <meta name="og:description" content={singlePost.content} />
        <meta name="og:image" content={
          singlePost.Images[0] 
            ? singlePost.Images[0].src
            : 'https://nodebird.com/favicon.png' 
          }
        />
        <meta name="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};
// export async function getStaticPaths() {
//   return {
//     paths: [
//       { params: { id: '1' } },
//       { params: { id: '2' } },
//       { params: { id: '3' } },
//     ],
//     fallback: false,
//   };
// }
// export const getStaticProps = wrapper.getStaticProps(async (context) => {
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('post getServerSideProps', context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  console.log('post getServerSideProps end');
  await context.store.sagaTask.toPromise();
});
export default Post;
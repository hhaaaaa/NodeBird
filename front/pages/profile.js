import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';
import useSWR from 'swr';

import { 
  // useDispatch, 
  useSelector, 
} from 'react-redux';
import { END } from 'redux-saga';

import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import AppLayout from '../components/AppLayout';
import { 
  // LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST,
  LOAD_MY_INFO_REQUEST,
} from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const profile = () => {
  // const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  // SWR 사용
  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);

  // swr 사용하면 필요 없음!!
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);
  
  // 로그인 하지 않은 채로 프로필 페이지로 이동할때 처리
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '내 정보 로딩중..';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    // return이 Hooks보다 위에 있으면 안된다!!!! (Hooks실행횟수는 항상 일정해야함!)
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  } 
  
  if (!followerError && !followingError) {
    console.log(followersData, followingsData);
  }

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        {/* <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} /> */}
        <FollowList 
          header="팔로잉" 
          data={followingsData} 
          onClickMore={loadMoreFollowings} 
          loading={!followingsData && !followingError} 
        />
        <FollowList 
          header="팔로워" 
          data={followersData} 
          onClickMOre={loadMoreFollowers} 
          loading={!followersData && !followerError} 
        />
      </AppLayout>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('profile getServerSideProps', context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('profile getServerSideProps end');
  await context.store.sagaTask.toPromise();
});
export default profile;
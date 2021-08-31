import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import { useSelector } from 'react-redux';

import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import AppLayout from '../components/AppLayout';

const profile = () => {
  const { me } = useSelector((state) => state.user);
  
  // 로그인 하지 않은 채로 프로필 페이지로 이동할때 처리
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.Followings} />
        <FollowList header="팔로워 목록" data={me.Followers} />
      </AppLayout>
    </>
  );
};
export default profile;
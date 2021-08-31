import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import {
  Input, Menu, Row, Col,
} from 'antd';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

// import { useRouter } from 'next/dist/client/router';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;
const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  .ant-col:first-child {
    padding-left: 0 !important;
  }
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  // 공지사항 참고
  // const router = useRouter();
  // return()에 코드 추가해야... 흠???

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>

      <Row gutter={8}>
        {' '}
        {/* gutter: 컬럼 사이의 간격 */}
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/*
            - target="_blank" : 새 창으로 열기
            - rel="noreferrer noopener" : 보안 상의 이유로 적어주는 것!
            - referrer: 이전 페이지
            - opener: 누가 나(새 창)을 열었는지
            - 두 정보를 없애서 보안의 위협을 없앰!
          */}
          <a href="https://www.naver.com" target="_blank" rel="noreferrer noopener">
            NAVER
          </a>
        </Col>
      </Row>
    </div>
  );
};
// npm i prop-types 로 설치
// 안정성을 위해 props로 넘기는 것들은 prop-types로 검사해주는 것이 좋음 (Typescript 사용한다면 생략)
// - 없어도 문제가 되는것은 아님!
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;

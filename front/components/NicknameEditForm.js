import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Input } from 'antd';
import Form from 'antd/lib/form/Form';

import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameInput = styled(Input.Search)`
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  padding: 20px;
`;

const NicknameEditForm = () => {
  const { me } = useSelector((state) => state.user);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form
      style={{ 
        marginBottom: '20px', 
        border: '1px solid #d9d9d9', 
        padding: '20px',
      }}
    >
      <NicknameInput 
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="닉네임" 
        enterButton="수정" 
        onSearch={onSubmit}
      />
    </Form>
  );
};
export default NicknameEditForm;
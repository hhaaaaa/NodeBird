import { Input } from 'antd';
import Form from 'antd/lib/form/Form';
import React from 'react';
import styled from 'styled-components';

const NicknameInput = styled(Input.Search)`
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
  padding: 20px;
`;

const NicknameEditForm = () => {
  return (
    <Form>
      <NicknameInput addonBefore="닉네임" enterButton="수정" />
    </Form>
  );
};
export default NicknameEditForm;
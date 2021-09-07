import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { Textarea } = Input;

const PostCardContent = ({ postData, editMode, onCancelUpdatePost, onChangePost }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post); 
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });

  return (
    <div>
      {editMode ? (
        <>
          <Textarea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
            <Button type="danger" onClick={onCancelUpdatePost}>삭제</Button>
          </Button.Group>
        </>
      ) : (
        /*
          '첫 번째 게시글 #해시태그 #익스프레스'를 예시로

          split위한 정규식: /(#[^\s#]+)/g
          - //g: 여러 개
          - []: 내부의 것만 찾겠다
          - ^: not
          - \s: 공백
          - +: 뒤에 한 개 이상의 글자
          => #으로 시작하고 공백#이 아닌 글자들을 여러 개 찾고싶다!
        */
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/g)) {
            return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}><a>{v}</a></Link>;
          }
          return v;
        })
      )}
    </div>
  );
};
PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool, 
  onCancelUpdatePost: PropTypes.func,
  onChangePost: PropTypes.func,
};
PostCardContent.defaultProps = {
  editMode: false,
  onCancelUpdatePost: () => {},
  onChangePost: () => {},
};
export default PostCardContent;
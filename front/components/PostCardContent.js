import React from 'react';
import Link from 'next/link';

import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => { 
  // '첫 번째 게시글 #해시태그 #익스프레스'를 예시로
  /*
    split위한 정규식: /(#[^\s#]+)/g
    - //g: 여러 개
    - []: 내부의 것만 찾겠다
    - ^: not
    - \s: 공백
    - +: 뒤에 한 개 이상의 글자
    => #으로 시작하고 공백#이 아닌 글자들을 여러 개 찾고싶다!
  */

  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/g)) {
          return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>;
        }
        return v;
      })}
    </div>
  );
};
PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};
export default PostCardContent;
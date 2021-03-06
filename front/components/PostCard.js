import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Card, Popover, List, Comment } from 'antd';
import { EllipsisOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'antd/lib/avatar/avatar';
import moment from 'moment';

import Link from 'next/link';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { 
  LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, 
  RETWEET_REQUEST, UPDATE_POST_REQUEST, 
} from '../reducers/post';
import FollowButton from './FollowButton';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);

  // const { me } = useSelector((state) => state.user);
  // const id = me && me.id; // &&: 앞이 true면 뒤 실행 / ||: 앞이 false면 뒤 실행
  // const id = me?.id; // Optional Chaining 연산자, 새로 생김
  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id);

  // const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    // boolean state 반전시킬때 많이 사용하는 방법
    // setLiked((prev) => !prev);
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);
  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다');
    }
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdatePost = useCallback(() => {
    setEditMode(false);
  }, []);

  const onChangePost = useCallback((editText) => () => {
    dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        PostId: post.id,
        content: editText,
      },
    });
  }, [post]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked 
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} /> 
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover key="more" content={(
            <Button.Group>
              {id && post.User.id === id ? (
                <>
                  {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
                  <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                </>
              ) : (
                <Button>신고</Button>
              )}
            </Button.Group>
          )}>
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId 
            ? `${post.User.nickname} 님이 리트윗했습니다.`
            : null
        }
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] 
              && <PostImages images={post.Retweet.Images} />
            }
          >
            <div style={{ float: 'right' }}>
              {moment(post.createdAt).fromNow()}
              {/* {moment(post.createdAt).format('YYYY.MM.DD')} */}
            </div>
            <Card.Meta 
              avatar={(
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent postData={post.Retweet.content} />
              }
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>
              {moment(post.createdAt).fromNow()}
              {/* {moment(post.createdAt).format('YYYY.MM.DD')} */}
            </div>
            <Card.Meta 
              avatar={(
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                </Link>
              )}
              title={post.User.nickname}
              description={(
                <PostCardContent 
                  editMode={editMode} 
                  onCancelUpdatePost={onCancelUpdatePost} 
                  onChangePost={onChangePost}
                  postData={post.content} 
                />
              )}
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List 
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment 
                  author={item.User.nickname}
                  avatar={(
                    <Link href={`/user/${item.User.id}`} prefetch={false}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};
export default PostCard;
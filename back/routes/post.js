const express = require('express');

const { User, Post, Comment, Image  } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// prefix를 받아와서
router.post('/', isLoggedIn, async (req, res) => {  // POST /post로 인식
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,  // deserializeUser()
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: Image },
        { 
          model: Comment,
          // 댓글 작성자
          include: [{ model: User, attributes: ['id', 'nickname'] }] 
        },
        // 게시글 작성자
        { model: User, attributes: ['id', 'nickname'] },
        // 좋아요 누른 사람 
        // (models/post associate에 정의된 as 그대로 입력해줘야 구별됨!)
        { model: User, as: 'Likers', attributes: ['id']},
      ],
    })
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res) => {  // POST /post/{postId}/comment로 인식
  try {
    const post = await Post.findOne({ 
      where: { id: req.params.postId * 1 }
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글 입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId * 1,
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: {id: comment.id },
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    })
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { 
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {  
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.status(200).json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post/1
router.delete('/:postId', isLoggedIn,  async (req, res, next) => {  
  try {
    await Post.destroy({
      where: { 
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: req.params.postId * 1});
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
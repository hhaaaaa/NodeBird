const express = require('express');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
  try {
    const posts = await Post.findAll({
      limit: 10,  // 10개만 가져와라
      // offset: 0,  // 1~10까지 -> 추가 삭제 시 문제
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        { 
          model: Comment, 
          include: [{ model: User, attributes: ['id', 'nickname'] }],
        },
        { model: User, as: 'Likers', attributes: ['id']},
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
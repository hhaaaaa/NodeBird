const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
  try {
    const where = {};
    if (req.query.lastId * 1) { // 초기 로딩이 아닐때
      where.id = { [Op.lt]: req.query.lastId * 1 }; // lastId 보다 작은
    }
    const posts = await Post.findAll({
      where,
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
        { model: Post, as: 'Retweet', include: [
          { model: User, attributes: ['id', 'nickname'] },
          { model: Image },
        ]},
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/related', async (req, res, next) => { // GET /posts/related
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        { mode: User, as: 'Followers', where: { id: req.user.id } }
      ],
    });
    const where = {
      UserId: { [Op.in]: followings.map((v) => v.id) },
    };
    if (req.query.lastId * 1) { // 초기 로딩이 아닐때
      where.id = { [Op.lt]: req.query.lastId * 1 }; // lastId 보다 작은
    }
    const posts = await Post.findAll({
      where,
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
        { model: Post, as: 'Retweet', include: [
          { model: User, attributes: ['id', 'nickname'] },
          { model: Image },
        ]},
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/unrelated', async (req, res, next) => { // GET /posts/unrelated
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        { mode: User, as: 'Followers', where: { id: req.user.id } }
      ],
    });
    const where = {
      UserId: { [Op.notIn]: followings.map((v) => v.id).concat(req.user.id) },
    };
    if (req.query.lastId * 1) { // 초기 로딩이 아닐때
      where.id = { [Op.lt]: req.query.lastId * 1 }; // lastId 보다 작은
    }
    const posts = await Post.findAll({
      where,
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
        { model: Post, as: 'Retweet', include: [
          { model: User, attributes: ['id', 'nickname'] },
          { model: Image },
        ]},
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
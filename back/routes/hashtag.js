const express = require('express');
const { Op } = require('sequelize');
const { 
  Post, Hashtag, Image, Comment, User 
} = require('../models');
const router = express.Router();

// GET /hashtag/노드
router.get('/:hashtag', async (req, res, next) => { 
  try {
    const where = {};
    if (req.query.lastId * 1) { 
      where.id = { [Op.lt]: req.query.lastId * 1 }; 
    }
    const posts = await Post.findAll({
      where,
      limit: 10, 
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
        { model: Hashtag, where: { 
          name: decodeURIComponent(req.params.hashtag) 
        } },
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
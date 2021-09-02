const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Comment, Image, Hashtag  } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더 없어서 생성..');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      // uploads라는 폴더에 저장하겠다
      //  - 나중에는 하드디스크가 아닌 아마존 웹 서비스 s3같은 클라우드에 저장
      //  - storage 옵션만 나중에 변경함
      done(null, 'uploads');
    },
    filename(req, file, done) { // hha.png
      // 확장자 추출(.png)
      const ext = path.extname(file.originalname);  
      // hha
      const basename = path.basename(file.originalname, ext);
      // hha1412343564.png (밀리초까지 붙임)
      done(null, basename + '_' + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// prefix를 받아와서
// POST /post로 인식
router.post(
  '/', 
  isLoggedIn, 
  upload.none(),  // multipart-form으로 변경됐으니 추가해줌!
  async (req, res) => {  
    try {
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      const post = await Post.create({
        content: req.body.content,
        UserId: req.user.id,  // deserializeUser()
      });
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map((tag) => Hashtag.findOrCreate({ 
            where: { name: tag.slice(1).toLowerCase() },
          }))
        );  // [[노드, true], [리액트, true]]의 형태
        await post.addHashtags(result.map((v) => v[0]));
      }
      if (req.body.image) { // formData.append('image', ~)
        if (Array.isArray(req.body.image)) {  // 여러개 이미지 업로드 (배열)
          // 한 번에 업로드한 모든 이미지가 DB에 저장됨
          //  - DB: 파일 주소만 가지고 있음
          //    - 파일 자체를 넣으면 db가 너무 무거워짐, 캐싱을 못함
          //  - s3클라우드: 파일 자체를 업로드, CDN 캐싱 적용
          const images = await Promise.all(
            req.body.image.map((image) => Image.create({ src: image }))
          );
          await post.addImages(images);
        } else {  // 이미지 한 개 업로드 (hha.png)
          const image = await Image.create({ src: req.body.image });
          await post.addImages(image);
        }
      }
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
  }
);

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

// POST /post/{postId}/retweet 인식
router.post('/:postId/retweet', isLoggedIn, async (req, res) => {  
  try {
    const post = await Post.findOne({ 
      where: { id: req.params.postId * 1 },
      include: [{ model: Post, as: 'Retweet' }],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글 입니다.');
    }
    if (
      req.user.id === post.UserId
      || (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: { 
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    })
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        { model: Post, as: 'Retweet', include: [
          { model: User, attributes: ['id', 'nickname'] },
          { model: Image },
        ]},
        { model: User, attributes: ['id', 'nickname'] },
        { model: Image },
        { model: Comment, include: [
          { model: User, attributes: ['id', 'nickname'] }
        ]},
        { model: User, as: 'Likers', attributes: ['id'] },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
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

// POST /post/images
//  - 로그인 검사 -> 이미지업로드 -> async는 이미지 업로드 후에 실행됨
router.post(
  '/images', 
  isLoggedIn, 
  // 한 장 올릴거면 upload.single('image')
  // text 혹은 json이면 upload.none()
  upload.array('image'),  
  async (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  }
);

module.exports = router;
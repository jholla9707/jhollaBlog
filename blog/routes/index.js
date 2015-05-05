var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment')

/* GET home page. */
router.get('/blogPosts', function(req, res, next) {
  Post.find(function(err, blogPosts){
    if(err){ return next(err); }

    res.json(blogPosts);
  });
});

router.post('/blogPosts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id){
	var query = Post.findById(id);

	query.exec(function (err, post){
		if (err) {return next(err);}
		if (!post) {return next(new Error('can\'t find post'));}

		req.post = post;
		return next();
	});
});


router.get('/blogPosts/:post', function(req, res){
	res.json(req.post);
});

router.param('comment', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.comment = comment;
    return next();
  });
});


router.post('/blogPosts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.get('/blogPosts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


module.exports = router;
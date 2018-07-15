// User's posts & comments
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//  Validation
const validatePostInput = require("../../validation/post");

//  @route GET to api/posts/tests
//  @desc Tests post route
//  @access Public
router.get("/test", (req, res) => res.json({
  msg: "Posts Works"
}));

//  @route GET to api/posts/
//  @desc GET Posts
//  @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      nopostsfound: "No posts found."
    }));
});

//  @route GET to api/post/:id
//  @desc GET Post by id
//  @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({
      nopostfound: "No post found with that ID"
    }));
});

//  @route POST to api/posts/
//  @desc Create Post
//  @access Private
router.post("/", passport.authenticate("jwt", {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  //  Check Validation
  if (!isValid) {
    //  If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

//  @route DELETE to api/posts/:id
//  @desc Delete post
//  @access Private
router.delete("/:id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //  Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not Authorized!"
            });
          }
          //  Delete
          post.remove().then(() => res.json({
            success: true
          }));
        })
        .catch(err => res.status(404).json({
          postnotfound: "No post found."
        }));
    })
});

//  @route POST to api/posts/like/:id
//  @desc Like post
//  @access Private
router.post("/like/:id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //  Check if user id is already in array | Check if user has already liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
              alreadyliked: "User already liked this post."
            });
          }
          //  Add user id to likes array
          post.likes.unshift({
            user: req.user.id
          });
          //  save to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
          postnotfound: "No post found."
        }));
    });
});

//  @route POST to api/posts/unlike/:id
//  @desc Unlike post
//  @access Private
router.post("/unlike/:id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //  Check if user id is already in array | Check if user has already liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
              alreadyliked: "You have not yet liked this post."
            });
          }
          //  Get remove index - select like to remove
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          // Splice out of array
          post.likes.splice(removeIndex, 1);
          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
          postnotfound: "No post found."
        }));
    });
});

//  @route POST to api/posts/comment/:id
//  @desc Add comment to post
//  @access Private
router.post("/comment/:id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  //  Check Validation
  if (!isValid) {
    //  If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      //  Add to comments array
      post.comments.unshift(newComment);
      //  Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({
      postnotfound: "No post found."
    }));
});

//  @route DELETE to api/posts/comment/:id/:comment_id
//  @desc Remove comment from post
//  @access Private
router.delete("/comment/:id/:comment_id", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      //  Check if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({
          commentnotexists: "Comment does not exist."
        });
      }
      // If it does exist, get the remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);
      //  Splice out of array
      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({
      postnotfound: "No post found."
    }));
});

module.exports = router;
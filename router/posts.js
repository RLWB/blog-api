const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../model/User");
const Post = require("../model/Post");
const handleToken = require("../middleWares");
const jwt = require("jsonwebtoken");
const verityToken = require("../middleWares/verityToken");
//发表文章
router.post("/", handleToken, async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error);
  }
});
//查询文章
router.get("/", verityToken, async (req, res) => {
  const username = req.query.user;
  const category = req.query.cat;
  const key = req.query.key;
  const query = {
    title: {
      $regex: key,
      $options: "i",
    },
  };
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await Post.find({ category });
    } else if (key) {
      posts = await Post.find(query);
    } else {
      posts = await Post.find();
    }
    posts.forEach((item) => {
      if (!req.user) {
        item.collected = false;
      } else {
        let index = item.collectionsIds.indexOf(req.user._id);
        console.log(index);
        if (index >= 0) {
          item.collected = true;
        } else {
          item.collected = false;
        }
      }
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});
//删除文章
router.delete("/:id", handleToken, async (req, res) => {
  const user = req.user;
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.username === user.username) {
      try {
        await post.delete();
        res.status(200).json("删除成功");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(404).json("没权限删除");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
module.exports = router;
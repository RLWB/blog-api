const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../model/User");
const Post = require("../model/Post");
const handleToken = require("../middleWares");
const jwt = require("jsonwebtoken");
const verityToken = require("../middleWares/verityToken");
//发表文章
router.post("/", handleToken, async (req, res) => {
  const newPost = new Post({
    ...req.body,
    userId: req.user._id,
    collected: false,
  });
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
      posts = await Post.find({ username })
        .sort({ createdAt: -1 })
        .populate("userId")
        .lean();
    } else if (category) {
      posts = await Post.find({ category })
        .sort({ createdAt: -1 })
        .populate("userId")
        .lean();
    } else if (key) {
      posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .populate("userId")
        .lean();
    } else {
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("userId")
        .lean();
    }
    console.log(req.user);
    if (req.user) {
      const user = await User.findById(req.user._id);
      console.log(user);
      if (!user) return res.status(200).json(posts);
      posts.forEach((item) => {
        if (user.collections.indexOf(item._id) >= 0) {
          item.collected = true;
        }
      });
    }
    return res.status(200).json(posts);

    // posts.forEach((item) => {
    //   if (!req.user) {
    //     item.collected = false;
    //   } else {
    //     let index = item.collectionsIds.indexOf(req.user._id);
    //     console.log(index);
    //     if (index >= 0) {
    //       item.collected = true;
    //     } else {
    //       item.collected = false;
    //     }
    //   }
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
//查询文章详情
router.get("/:id", verityToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
//删除文章
router.delete("/:id", handleToken, async (req, res) => {
  const user = req.user;
  try {
    const post = await Post.findById(req.params.id).populate("userId");
    console.log(post);
    if (post.userId.username === user.username) {
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

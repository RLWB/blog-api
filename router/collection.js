const router = require("express").Router();
const User = require("../model/User");
const Post = require("../model/Post");
const handleToken = require("../middleWares");
//收藏，取消收藏
router.post("/", handleToken, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    const user = await User.findById(req.user._id);
    const index = post.collectionsIds.findIndex((item) => item == req.user._id);
    if (index >= 0) {
      post.collectionsIds.splice(index, 1);
      user.collections.splice(user.collections.indexOf(id), 1);
    } else {
      post.collectionsIds.unshift(req.user._id);
      user.collections.unshift(id);
    }
    await post.save();
    await user.save();
    res.status(200).json("操作成功");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.get("/", handleToken, async (req, res) => {
  try {
    const collect = await User.findById(req.user._id).populate("collections");
    res.status(200).json({ collections: collect.collections });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

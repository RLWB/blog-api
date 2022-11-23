const router = require("express").Router();
const User = require("../model/User");
const Post = require("../model/Post");
const handleToken = require("../middleWares");

router.post("/", handleToken, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    const index = post.collectionsIds.findIndex((item) => item == req.user._id);
    console.log(index);
    if (index >= 0) {
      post.collectionsIds.splice(index, 1);
    } else {
      post.collectionsIds.unshift(req.user._id);
    }
    await post.save();
    res.status(200).json("操作成功");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

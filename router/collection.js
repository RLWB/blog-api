const router = require("express").Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Collection = require("../model/Collection");
const handleToken = require("../middleWares");
//收藏，取消收藏
router.post("/", handleToken, async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findById(req.user._id);
    const index = user.collections.indexOf(id);
    if (index >= 0) {
      user.collections.splice(index, 1);
    } else {
      user.collections.unshift(id);
    }
    await User.updateOne(
      {
        _id: req.user._id,
      },
      user
    );
    res.status(200).json("操作成功");
  } catch (error) {
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

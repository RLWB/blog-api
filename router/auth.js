const router = require("express").Router();
const md5 = require("md5");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const key = "jsonwebtoken";
//注册
router.post("/register", async (req, res) => {
  try {
    const cryptPass = md5(req.body.password);
    const newUser = new User({
      username: req.body.username,
      password: cryptPass,
      email: req.body.email,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
//登录
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("用户名不存在");
    if (md5(req.body.password) !== user.password)
      return res.status(400).json("密码错误");
    const { password, ...others } = user._doc;
    return res
      .status(200)
      .json({ ...others, token: jwt.sign({ ...others }, key) });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

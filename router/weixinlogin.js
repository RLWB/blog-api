const axios = require("axios");
const router = require("express").Router();
const User = require("../model/User");
const APPID = "wxf52721957f034b4b";
const secret = "7ed9f31829c25dc20cb813c16ec03c29";
const jwt = require("jsonwebtoken");
const key = "jsonwebtoken";
router.post("/", async (req, res) => {
  const { code } = req.body;
  const data = await axios.get(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  );
  console.log(data.data.openid);
  if (data.data.openid) {
    try {
      const user = await User.findOne({ openid: data.data.openid });
      console.log(user._doc);
      if (!user) return res.status(400).send("尚未关联账号密码，请关联");
      const { password, ...other } = user._doc;
      res.status(200).send({
        ...other,
        token: jwt.sign({ ...others }, key, {
          expiresIn: "360000s",
        }),
      });
    } catch (error) {
      res.status(500).send("出错了");
    }
  }
  console.log(data.data);
});
router.post("/connect", async (req, res) => {
  try {
    if (!req.body.openid) return res.status(400).json("openid不能为空");
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("用户名不存在");
    if (md5(req.body.password) !== user.password)
      return res.status(400).json("密码错误");
    user.openid = req.body.openid;
    user.save();
    res.status(200).json("关联成功");
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

const jwt = require("jsonwebtoken");
const User = require("../model/User");
const key = "jsonwebtoken";
const handleToken = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json("用户未登录");
  try {
    const user = jwt.verify(req.headers.authorization, key);
    const userInfo = await User.find({ username: user });
    if (userInfo) {
      req.user = user;
    } else {
      return res.status(401).json("token无效");
    }
  } catch (error) {
    return res.status(401).json("token无效");
  }
  next();
};

module.exports = handleToken;

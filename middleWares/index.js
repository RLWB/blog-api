const jwt = require("jsonwebtoken");
const key = "jsonwebtoken";
const handleToken = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json("用户未登录");
  try {
    jwt.verify(req.headers.authorization, key);
  } catch (error) {
    return res.status(401).json("token无效");
  }
  next();
};

module.exports = handleToken;

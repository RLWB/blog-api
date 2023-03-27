const jwt = require("jsonwebtoken");
const key = "jsonwebtoken";
const handleToken = (req, res, next) => {
  try {
    const user = jwt.verify(req.headers.authorization, key);
    req.user = user;
  } catch (error) {
    console.log("token无效:", error);
  }
  next();
};

module.exports = handleToken;

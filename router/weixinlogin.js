const axios = require("axios");
const router = require("express").Router();
const APPID = "wxf52721957f034b4b";
const secret = "7ed9f31829c25dc20cb813c16ec03c29";
router.post("/", async (req, res) => {
  const { code } = req.body;
  const data = await axios.get(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  );
  console.log(data);
});

module.exports = router;

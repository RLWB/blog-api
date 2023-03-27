const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./router/auth");
const postsRoute = require("./router/posts");
const collectRoute = require("./router/collection");
const handleToken = require("./middleWares/index");
app.use(express.json());

mongoose
  .connect(
    // "mongodb+srv://root:googledns8888@cluster0.bnhuhf8.mongodb.net/?retryWrites=true&w=majority",
    // "mongodb://0.0.0.0:27017/blogs",
    "mongodb://112.124.0.240:27017/blog",
    {
      useNewURLParser: true,
    }
  )
  .then(console.log("Connected success!"))
  .catch((err) => console.log("出错了：", err));
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/post/collect", collectRoute);
app.listen(5000, () => {
  console.log(`Server is running in http://localhost:5000`);
});

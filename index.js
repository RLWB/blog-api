const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./router/auth");
app.use(express.json());

mongoose
  .connect(
    // "mongodb+srv://root:googledns8888@cluster0.bnhuhf8.mongodb.net/?retryWrites=true&w=majority",
    "mongodb://112.124.0.240:27017/blog",
    {
      useNewURLParser: true,
    }
  )
  .then(console.log("Connected success!"))
  .catch((err) => console.log("出错了：", err));
app.use("/api/auth", authRoute);
app.listen(5000, () => {
  console.log(`Server is running in http://localhost:5000`);
});

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://ts4.cn.mm.bing.net/th?id=OIP.CZpj-JDS3saSZNdsCll5lgHaHa&w=80&h=80&c=7&rs=1&qlt=100&o=6&dpr=2.2&pid=AlgoBlock",
    },
    openid: String,
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

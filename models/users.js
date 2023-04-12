const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const usersSchema = new Schema(
  {
    user: String,
    password: String,
    name: String,
    plan_details: String,
  },
  { collection: "Users" }
);
const Users = mongoose.model("Users", usersSchema);
module.exports = Users;

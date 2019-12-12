const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema User
const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  numberPhone: {
    type: String,
    require: true
  },
  tempPassword: {
    type: String,
    default: ""
  },
  key: {
    type: String,
    default: ""
  },
  purchased: {
    type: Boolean,
    default: false
  },

  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = User = mongoose.model("users", UserSchema);

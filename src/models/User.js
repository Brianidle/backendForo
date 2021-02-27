const moongose = require('mongoose');

const userSchema = new moongose.Schema(
  {
    username: {
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
    avatar: {
      type: String,
      required: true
    },
    foroPoints: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const User = moongose.model('User', userSchema);

module.exports = User;

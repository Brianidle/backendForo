require('dotenv').config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('../util/gravatar');

module.exports = {
  signUp: async (parent, { username, email, password }, { models }) => {
    let hashedPassword = await bcrypt.hash(password, 10);
    let avatar = gravatar(email);

    try {
      let user = await models.User.create({
        username: username,
        email: email,
        password: hashedPassword,
        avatar
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);

      throw new Error('Error creating account');
    }
  },
  newPost: async (parent, { idAuthor, title, content }, { models }) => {
    let post = await models.Post.create({
      author: mongoose.Types.ObjectId(idAuthor),
      title,
      content
    });

    return post;
  }
};

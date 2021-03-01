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
  newPost: async (parent, { idAuthor, title, content, urlImage }, { models }) => {
    try {
      return await models.Post.create({
        author: mongoose.Types.ObjectId(idAuthor),
        title,
        content,
        urlImage
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error creating a new post');
    }
  },
  newComment: async (parent, { idAuthor, idPost, content }, { models }) => {
    try {
      await models.Comment.create({
        author: mongoose.Types.ObjectId(idAuthor),
        post: mongoose.Types.ObjectId(idPost),
        content,
        hasParentComment:false
      });
      return 'COMMENT_CREATED';
    } catch (err) {
      console.log(err);
      throw new Error('Error creating a new commet');
    }
  },
  newCommentReply: async (
    parent,
    { idComment, idAuthor, idPost, content },
    { models }
  ) => {
    try {
      let commentReplyCreated = await models.Comment.create({
        author: mongoose.Types.ObjectId(idAuthor),
        post: mongoose.Types.ObjectId(idPost),
        content,
        hasParentComment:true
      });

      await models.ParentChildComment.create({
        idParentComment: mongoose.Types.ObjectId(idComment),
        idChildComment: mongoose.Types.ObjectId(commentReplyCreated._id)
      });

      return 'COMMENT_REPLY_CREATED';
    } catch (err) {
      console.log(err);
      throw new Error('Error creating a new commet');
    }
  }
};

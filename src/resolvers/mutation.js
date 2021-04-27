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
      await models.User.create({
        username: username,
        email: email,
        password: hashedPassword,
        avatar
      });

      return "USER_CREATED";
    } catch (err) {
      return "ERROR_USER_CREATED";
    }
  },
  newPost: async (
    parent,
    { title, content, urlImage },
    { models, idUser }
  ) => {

    if (!idUser) {
      throw new Error('User Not Authenticated');
    }
    try {
      return await models.Post.create({
        author: idUser.id,
        title,
        content,
        urlImage
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error creating a new post');
    }
  },
  editPost: async (
    parent,
    { idPost, content, title, urlImage },
    { models, idUser }
  ) => {

    if (!idUser) {
      throw new Error('User Not Authenticated');
    }

    let newChangues = {};
    //the validations are done in the front-end
    newChangues.content = content;
    newChangues.title = title;
    newChangues.urlImage = urlImage;

    try {
      await models.Post.findByIdAndUpdate(idPost, {
        $set: newChangues
      });
      return 'POST_EDITED';
    } catch (err) {
      return 'ERROR_POST_EDITED';
    }
  },
  deletePost: async (parent, { idPost }, { models, idUser }) => {
    if (!idUser) {
      throw new Error('User Not Authenticated');
    }

    let post = await models.Post.findOne({ _id: idPost });
    if (post) {
      await post.remove();
      return true;
    } else {
      return false;
    }
  },
  upvotePost: async (parent, { idPost }, { models, idUser }) => {
    let userVote = await models.DownUpVotePostUser.findOne({ idPost, idUser: idUser.id });

    if (userVote) {
      if (userVote.vote == -1) {
        await models.Post.findOneAndUpdate({ _id: idPost }, { $inc: { foroPoints: 1 } });
        userVote.vote = 1;

        await userVote.save();
        return true;
      } else {
        return false;
      }
    } else {
      await models.Post.findOneAndUpdate({ _id: idPost }, { $inc: { foroPoints: 1 } });
      await models.DownUpVotePostUser.create({
        idPost: idPost,
        idUser: idUser.id,
        vote: 1
      });

      return true;
    }
  },
  downvotePost: async (parent, { idPost }, { models, idUser }) => {
    let userVote = await models.DownUpVotePostUser.findOne({ idPost, idUser: idUser.id });

    if (userVote) {
      if (userVote.vote == 1) {
        await models.Post.findOneAndUpdate({ _id: idPost }, { $inc: { foroPoints: -1 } });

        userVote.vote = -1;
        await userVote.save();

        return true;
      } else {

        return false;
      }
    } else {
      await models.Post.findOneAndUpdate({ _id: idPost }, { $inc: { foroPoints: -1 } });

      await models.DownUpVotePostUser.create({
        idPost: idPost,
        idUser: idUser.id,
        vote: -1
      });

      return true;
    }
  },
  newComment: async (parent, { idAuthor, idPost, content }, { models, idUser }) => {
    if (!idUser) {
      throw new Error('User Not Authenticated');
    }

    try {
      await models.Comment.create({
        author: mongoose.Types.ObjectId(idAuthor),
        post: mongoose.Types.ObjectId(idPost),
        content,
        hasParentComment: false
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
        hasParentComment: true
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
  },
};

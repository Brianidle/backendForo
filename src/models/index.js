const Comment = require('./Comment');
const ParentChildComment = require('./ParentChildComment');
const Post = require('./Post');
const User = require('./User');
const DownUpVotePostUser = require('./DownUpVotePostUser');

const models = {
  Comment,
  ParentChildComment,
  Post,
  User,
  DownUpVotePostUser
};

module.exports = models;

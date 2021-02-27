const mongoose = require('mongoose');

const parentChildCommentSchema = new mongoose.Schema({
  idParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  idChild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }
});

const ParentChildComment = mongoose.model(
  'CommentRelation',
  parentChildCommentSchema
);

module.exports = ParentChildComment;

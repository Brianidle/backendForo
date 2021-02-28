const mongoose = require('mongoose');

const parentChildCommentSchema = new mongoose.Schema({
  idParentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  idChildComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }
});

const ParentChildComment = mongoose.model(
  'ParentChildComment',
  parentChildCommentSchema
);

module.exports = ParentChildComment;

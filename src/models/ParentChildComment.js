const moongose = require('mongoose');

const parentChildCommentSchema = new moongose.Schema({
  idParent: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  idChild: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

const ParentChildComment = mongoose.model(
  'CommentRelation',
  parentChildCommentSchema
);

module.exports = ParentChildComment;

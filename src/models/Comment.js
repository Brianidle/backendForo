const moongose = require('moongose');

const commentSchema = new moongose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Comment = moongose.model('Comment', commentSchema);

module.exports = Comment;

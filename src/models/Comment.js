const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    foroPoints:{
      type:Number,
      required:true,
      default: 0
    },
    hasParentComment:{
      type:Boolean,
      required:true
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

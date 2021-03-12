module.exports = {
  author: async (post, args, { models }) => {
    return await models.User.findOne({_id:post.author});
  }
};

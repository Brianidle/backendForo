module.exports = {
  posts: async (parent, args, { models }) => {
    return await models.Post.find()
    }
};

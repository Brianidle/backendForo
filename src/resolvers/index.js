const Query = require('./query');
const Mutation = require('./mutation');
const Post = require('./post');

const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
  Query,
  Mutation,
  Post,
  DateTime: GraphQLDateTime
};

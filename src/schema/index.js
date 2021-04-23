const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar DateTime

    type Comment {
        id:ID
        author:ID!
        content:String!
    }

    type Post {
        id:ID
        author:User!
        title:String!
        content:String
        urlImage:String
        belongsToTheAuthenticatedUser:Boolean
        createdAt: DateTime!
    }

    type User{
        id:ID
        username:String!
        email:String!
        avatar:String!
    }

    type Query {
        usernameAlreadyExists(username:String!):Boolean
        signIn(username: String!, password: String!): String
        post(idPost:ID!):Post
        posts:[Post]
        comments(idPost:String!):[Comment]
        authorPosts: [Post]
    }

    type Mutation {
        signUp(username:String!, email:String!, password:String!):String
        newPost( title:String!, content:String, urlImage:String ):Post
        newComment(idAuthor:String!, idPost:String!, content:String!):String
        newCommentReply(idComment:String!, idAuthor:String!, idPost:String!, content:String!):String
        editPost(idPost:ID!, content:String, title:String, urlImage:String):String
        deletePost(idPost:ID!):Boolean
    }
`;

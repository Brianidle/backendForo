const { gql } = require('apollo-server-express');

module.exports = gql`
    type Comment {
        id:ID
        author:ID!
        content:String!
    }

    type Post {
        id:ID
        author:String!
        title:String!
        content:String
        urlImage:String
    }

    type User{
        username:String!
        email:String!
        image:String
        avatar:Int!
    }

    type Query {
        usernameAlreadyExists(username:String!):Boolean
        signIn(username: String!, password: String!): String
        posts:[Post]
        comments(idPost:String!):[Comment]
        authorPosts(idAuthor:ID!): [Post]
    }

    type Mutation {
        signUp(username:String!, email:String!, password:String!):String
        newPost(idAuthor:String!, title:String!, content:String, urlImage:String ):Post
        newComment(idAuthor:String!, idPost:String!, content:String!):String
        newCommentReply(idComment:String!, idAuthor:String!, idPost:String!, content:String!):String
    }
`;

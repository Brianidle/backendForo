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
        authorPosts(idAuthor:ID!): [Post]
    }

    type Mutation {
        signUp(username:String!, email:String!, password:String!):String
        newPost(idAuthor:String!, title:String!, content:String, urlImage:String ):Post
        newComment(idAuthor:String!, idPost:String!, content:String!):String
        newCommentReply(idComment:String!, idAuthor:String!, idPost:String!, content:String!):String
        editPost(idPost:ID!, newContent:String, newTitle:String, newUrlImage:String):String
        deletePost(idPost:ID!):Boolean
    }
`;

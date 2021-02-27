const {gql } = require('apollo-server-express'); 

module.exports=gql`
    type Comment {
        id:ID
        author:ID!
        content:String!
    }

    type Post {
        id:ID
        author:String!
        title:String!
        content:String!
    }

    type User{
        username:String!
        email:String!
        image:String
        avatar:Int!
    }

    type Query {
        posts:[Post]
    }

    type Mutation {
        signUp(username:String!, email:String!, password:String!):String
        newPost(idAuthor:String!, title:String!, content:String! ):Post
    }
`;
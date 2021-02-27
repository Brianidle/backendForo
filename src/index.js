const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { ApolloServer } = require('apollo-server-express');

require('dotenv').config();

const db = require('./db');
const express = require('express');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const models = require('./models');
//---------------------------------------------------------------------

const app = express();
db.connect(DB_HOST);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  }
});

apolloServer.applyMiddleware({app, path:'/'});

app.listen({ port }, () =>
  console.log(
    `GraphQL Server activated on this address http://localhost:${port}`
  )
);

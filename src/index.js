const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

require('dotenv').config();

const db = require('./db');
const express = require('express');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const models = require('./models');
//---------------------------------------------------------------------

const app = express();

app.use(cors());
db.connect(DB_HOST);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  }
});

apolloServer.applyMiddleware({app, path:'/foroApi'});

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${apolloServer.graphqlPath}`
  )
);

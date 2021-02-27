require('dotenv').config();

const db = require('./db');
const express = require('express');
const port = process.env.PORT || 4000;

//---------------------------------------------------------------------

const app = express();

const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

app.listen({ port }, () =>
  console.log(
    `GraphQL Server activated on this address http://localhost:${port}`
  )
);

const express = require('express');

// Run our server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

const app = express();

app.listen({ port }, () =>
  console.log(
    `GraphQL Server activated on this address http://localhost:${port}`
  )
);

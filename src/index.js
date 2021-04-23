const typeDefs = require('./schema');
const resolvers = require('./resolvers');

var bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

var corsOptions = {
  origin: process.env.ACAOrigin_URL,
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/foroApi/signin", async (req, res) => {
  try {

    let cookiesArray = [];
    let token;
    let username = req.body.username;
    let password = req.body.password;

    res.header('Access-Control-Allow-Origin', process.env.ACAOrigin_URL);

    let user = await models.User.findOne({ username });

    if (user) {
      let valid = await bcrypt.compare(password, user.password);

      if (valid) {
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        let usersessionCookie = 'user_session=' + token + '; expires=' + new Date(Date.now() + 1296000000).toUTCString() + '; secure; SameSite=None';
        let usernameCookie = 'username=' + user.username + '; expires=' + new Date(Date.now() + 1296000000).toUTCString() + '; secure; SameSite=None';

        cookiesArray.push(usersessionCookie);
        cookiesArray.push(usernameCookie);

        res.setHeader('Set-Cookie', cookiesArray);

        return res.send("Authorized User");
      } else {
        return res.status(401).send("Unauthorized User");
      }
    } else {
      return res.status(401).send("Unauthorized User");
    }

  } catch (err) {
    console.log(err);
  }
}
);

app.get("/foroApi/logout", (req, res) => {
  deleteUserAutenticationCookies(res);

  res.send("Logged Out");
});

db.connect(DB_HOST);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    res.header('Access-Control-Allow-Origin', process.env.ACAOrigin_URL);

    let idUser;
    let jsonCookies;

    let cookies = req.header('Cookie');

    if (cookies) {
      jsonCookies = getJsonCookies(cookies);

      let token = jsonCookies.user_session;

      try {
        idUser = getUser(token);
        res.status(200);
      } catch (err) {
        deleteUserAutenticationCookies(res);

        return res.status(401).send("Unauthorized User");
      }
    }

    return { models, idUser };
  }
});

apolloServer.applyMiddleware({ app, path: '/foroApi' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${apolloServer.graphqlPath}`
  )
);

const getUser = token => {
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};

const getJsonCookies = (cookiesString) => {
  let jsonCookies;

  let cookiesStringTrim = cookiesString.replace(" ", "");
  let keyEqualValueCookiesArray = cookiesStringTrim.split(";");

  keyEqualValueCookiesArray.forEach(keyEqualValueCookie => {
    let keyValue = keyEqualValueCookie.split("=");
    jsonCookies = { ...jsonCookies, [keyValue[0]]: keyValue[1] }
  });

  return jsonCookies;
};

const deleteUserAutenticationCookies=(res) => {
  res.setHeader('Set-Cookie', ['user_session="";' + 'expires=' + new Date(Date.now() - 1296000000).toUTCString() + '; secure; SameSite=None',
  'username="";' + 'expires=' + new Date(Date.now() - 1296000000).toUTCString() + '; secure; SameSite=None']);
}
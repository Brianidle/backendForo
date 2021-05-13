const http = require('http');

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
db.connect(DB_HOST);

var corsOptions = {
  origin: process.env.ACAOrigin_URL,
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const server = http.createServer(app);

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
      if (token) {
        //if it is not possible to get an object decoded by jwt and it trows an exception the catch block handles it.  
        try {
          idUser = getUser(token);

          res.status(200);
        } catch (err) {
          deleteUserAutenticationCookies(res);

          return res.status(401).send("Unauthorized User");
        }
      } else {
        //custom status code used to tell the request arrived without the user_session cookie, or in other words it arrived without the autentication cookie
        deleteUserAutenticationCookies(res);
        res.status(230);
      }
    } else {
      //custom status code used to tell the request arrived without the user_session cookie, or in other words it arrived without the autentication cookie
      res.status(230);
    }

    return { models, idUser };
  }
});

apolloServer.applyMiddleware({ app, path: '/foroApi' });

app.get("/test", (req, res) => {
  res.status(200).send("Test");
});

app.post("/signin", async (req, res) => {
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
        return res.send("Unauthorized User");
      }
    } else {
      return res.send("Unauthorized User");
    }

  } catch (err) {
    console.log(err);
  }
}
);

app.get("/logout", (req, res) => {
  deleteUserAutenticationCookies(res);

  res.send("Logged Out");
});

const boot = () => {
  server.listen(port, () => {
    console.log(
      `GraphQL Server running at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `Express Server running at http://localhost:${port}`
    );
  })
}

const getUser = token => {
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};

const shutdown = () => {
  server.close();
}

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

const deleteUserAutenticationCookies = (res) => {
  res.setHeader('Set-Cookie', ['user_session="";' + 'expires=' + new Date(Date.now() - 1296000000).toUTCString() + '; secure; SameSite=None',
  'username="";' + 'expires=' + new Date(Date.now() - 1296000000).toUTCString() + '; secure; SameSite=None']);
}

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = port;
}
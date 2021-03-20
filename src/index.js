const express = require("express");
const jwt = require("jsonwebtoken");
const { ApolloServer, gql, registerServer } = require("apollo-server-express");

require("dotenv").config();
const models = require("./models");
const db = require("./db");
const typeDefs = require("./gql-schema");
const resolvers = require("./resolvers");

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
const app = express();

// get user information from jsonwebtoken
const getUser = token => {
    if(token) {
        try {
            // return user informations using from the token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Error- Session invalid");
        }
    }
}

db.connect(DB_HOST);

const apolloServer = new ApolloServer(
    { 
        typeDefs, 
        resolvers,
        context: ({ req }) => {
            // get user token from the headers
            const token = req.headers.autorization;
            const userInformation = getUser(token);
            // console.log(userInformation);
            return { models, userInformation };
        }
    }
);
apolloServer.applyMiddleware({ app, path:"/api" });

app.listen(
    { port },
    () => {
        console.log(`GraphQL is serving at http://localhost:${port}${apolloServer.graphqlPath}`);
    }
);



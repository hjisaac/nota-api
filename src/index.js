require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const db = require("./db");

const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }

    type Mutation {
        createNote(content: String!): Note!

    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello world",
        notes: () => "",
        note: () => ""
    },

    Mutation: {
        createNote: () => ""
    }
};

db.connect(DB_HOST);
const app = express();

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app, path: "/api" })


app.listen(
    { port },
    () => {
        console.log(`GraphQL Server listening at http://localhost:${port}${apolloServer.graphqlPath}`);
    }
);
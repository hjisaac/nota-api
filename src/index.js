const express = require("express");
const { ApolloServer, gql, registerServer } = require("apollo-server-express");

require("dotenv").config();
const models = require("./models");
const db = require("./db");

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
const app = express();

const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }

    type Query {
        hello: String
        note(id: ID!): Note!
        notes: [Note!]!
    }

    type Mutation {
        createNote(content: String!): Note!
    }
`;

let notesData = [
    {
        id: "1",
        author: "Georges Tim",
        content: "This is the first note"
    },
    {
        id: "2",
        author: "Kotomi Tim",
        content: "This is the second note"
    },
    {
        id: "3",
        author: "Kotomi Tim",
        content: "This is the third note"
    }
];

const resolvers = {
    Query: {
        hello: () => "lorem ipsum dolores",
        notes: async () => {
            return await models.Note.find();
        },
        note: async (parent, args) => {
            return await models.Note.findById(args.id);
        }
    },
    Mutation: {
        createNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: "Foo Bar"
            });
        } 
    }
}

db.connect(DB_HOST);

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app, path:"/api" });

app.listen(
    { port },
    () => {
        console.log(`GraphQL is serving at http://localhost:${port}${apolloServer.graphqlPath}`);
    }
);

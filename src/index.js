const express = require("express");
const { ApolloServer, gql, registerServer } = require("apollo-server-express");

const port = process.env.PORT || 4000;
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
        createNote: Note!
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
        notes: () => notesData,
        note: (parent, args) => {
            return notesData.find(note => note.id === args.id);
        }
    },
    Mutation: {
        createNote: (parent, args) => {
            let newNote = {
                id: notesData.length + 1,
                content: "my new note",
                author: "Foo Bar"
            }
            notesData.push(newNote);
            return newNote;
        } 
    }
}

const apolloServer = new ApolloServer({ typeDefs, resolvers });

apolloServer.applyMiddleware({ app, path:"/api" });

app.listen(
    { port },
    () => {
        console.log(`GraphQL is serving at http://localhost:${port}${apolloServer.graphqlPath}`);
    }
);

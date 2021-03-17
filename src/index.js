const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

const port = process.env.PORT || 4000;
const typeDefs = gql`
    type Note
    type Query {
        hello: String
    }

    type Query {
        Note: {

        }
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello world"
    }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

apolloServer.applyMiddleware({ app, path: "/api" })


app.listen(
    { port },
    () => {
        console.log(`GraphQL Server listening at http://localhost:${port}${apolloServer.graphqlPath}`);
    }
);
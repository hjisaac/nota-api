const { gql } = require("apollo-server-express");
 
const typeDefs = gql`
    scalar DateTime

    type Note {
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
    }

    type Query {
        hello: String
        note(id: ID!): Note!
        notes: [Note!]!
    }

    type Mutation {
        createNote(content: String!): Note!
        updateNote(id: ID!, content:String!): Note!
        deleteNote(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!

    }
`;

module.exports = typeDefs;
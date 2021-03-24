const { gql } = require("apollo-server-express");
 
const typeDefs = gql`
    scalar DateTime

    type Note {
        id: ID!
        content: String!
        author: User!
        favoriteCount: Int!
        favoritedBy: [User!]
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String
        notes: [Note!]!
        favorites: [Note!]!
    }

    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNext: Boolean!
    }

    type Query {
        hello: String
        note(id: ID!): Note!
        notes: [Note!]!
        user(username: String!): User!
        users: [User!]!
        me: User!
        noteFeed(cursor: String): NoteFeed
    }

    type Mutation {
        createNote(content: String!): Note!
        updateNote(id: ID!, content:String!): Note!
        deleteNote(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
        toggleFavorite(id: ID!): Note!
    }
`;

module.exports = typeDefs;
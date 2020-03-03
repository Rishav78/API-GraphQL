
const { buildSchema  } = require('graphql');

module.exports = buildSchema(`
    type MessageReceivedBy {
        _id: ID!
        seen: Boolean!
        user: ID!
    }

    type Message {
        _id: ID!
        sender: ID!
        message: String!
        receivedby: [MessageReceivedBy!]!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        firstname: String!
        lastname: String!
        phone: String!
        password: String
        friends: [User!]!
        activeChats: [ID!]!
        status: Boolean!
        updatedAt: String!
        createdAt: String!
    }

    type AuthData {
        _id: ID!
        token: String!
        expiresIn: Int!
    }

    input inputUser {
        firstname: String!
        lastname: String!
        phone: String!
        password: String!
    }

    input messageReceivedBy {
        seen: Boolean!
        user: ID!
    }

    input inputMessage {
        sender: ID!
        message: String!
        receivedby: [messageReceivedBy]!
    }

    type RootQuery {
        messages: [Message!]!
        message(_id: ID): Message
        users: [User!]!
        userById(_id: ID): User
        Login(phone: String!, password: String!): AuthData!
    }

    type RootMutation {
        createMessage(InputMessage: inputMessage): Message
        createUser(InputUser: inputUser): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
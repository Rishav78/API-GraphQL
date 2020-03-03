
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

    type Chat {
        _id: ID!
        chattype: Boolean!
        chatname: String!
        chatmembers: [User!]!
        messages: [Message!]!
        imageid: String!
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
    input inputChat {
        chattype: Boolean!
        chatname: String
        chatmembers: [ID!]!
        imageid: String = "Default.png"
    }

    type RootQuery {
        login(phone: String!, password: String!): AuthData!
        users: [User!]!
        userById(_id: ID): User
        chats: [Chat!]!
        chatById(_id: ID!): Chat
        messages: [Message!]!
        messageById(_id: ID): Message
    }

    type RootMutation {
        createMessage(InputMessage: inputMessage): Message
        createUser(InputUser: inputUser): User
        createChat(InputChat: inputChat): Chat
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
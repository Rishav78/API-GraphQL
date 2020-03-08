
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
        chattype: String!
        chatname: String
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
        email: String!
        password: String
        friends: [User!]!
        activeChats: [ID!]!
        status: Boolean!
        updatedAt: String!
        createdAt: String!
    }

    type AuthData {
        token: String!
        expiresIn: Int!
    }

    type Error {
        success: Boolean
        msg: String
    }

    input inputUser {
        firstname: String!
        lastname: String!
        email: String!
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
        chattype: String!
        chatname: String
        chatmembers: [ID!]!
        imageid: String = "Default.png"
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        users: [User!]!
        userById(_id: ID): User
        chats: [Chat!]!
        chatById(_id: ID!): Chat
        messages: [Message!]!
        messageById(_id: ID): Message
    }

    type RootMutation {
        CreateMessage(InputMessage: inputMessage): Message
        CreateUser(InputUser: inputUser): User
        CreateChat(InputChat: inputChat): Chat
        AddFriend(friendId: ID!): Error!
        RemoveFriend(friendId: ID!): Error!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
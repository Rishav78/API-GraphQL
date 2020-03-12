exports.Message = `
    type Message {
        _id: ID!
        sender: User!
        messagetype: String!
        message: String
        file: Media
        receivedby: [MessageReceivedBy!]!
        createdAt: String!
        updatedAt: String!
    }

    type MessageReceivedBy {
        _id: ID!
        seen: Boolean!
        user: ID!
    }
`;

exports.InputMessage = `
    input messageReceivedBy {
        seen: Boolean!
        user: ID!
    }

    input inputMessage {
        sender: ID!
        message: String!
        receivedby: [messageReceivedBy]!
    }
`;

exports.MessageQuries = `
    messages: [Message!]!
    messageById(_id: ID): Message
`;

exports.MessageMutations = `
    CreateMessage(InputMessage: inputMessage): Message
`;
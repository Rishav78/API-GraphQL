exports.Chat = `
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
`;

exports.InputChat = `
    input inputChat {
        chattype: String!
        chatname: String
        chatmembers: [ID!]!
        imageid: String = "Default.png"
    }
`;

exports.ChatQuries = `
    chats: [Chat!]!
    chatById(_id: ID!): Chat
`

exports.ChatMutations = `
    CreateChat(InputChat: inputChat): Chat
`;
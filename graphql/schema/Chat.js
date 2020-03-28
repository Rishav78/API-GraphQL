exports.Chat = `
    type Chat {
        _id: ID!
        chattype: String!
        chatname: String
        chatmembers: [User!]!
        messages: [Message!]!
        imageid: String
        createdAt: String!
        updatedAt: String!
    }
    type Chats {
        chats: [Chat!]
        err: String
    }
`;

exports.InputChat = `
    input inputPersonalChat {
        chatmember: ID!
    }
    input inputGroupChat {
        chatname: String!
        chatmembers: [ID!]!
        imageid: String
    }
`;

exports.ChatQuries = `
    chats: Chats!
    chat(_id: ID!): Chat
`;

exports.ChatMutations = `
    CreatePersonalChat(InputChat: inputPersonalChat): Chat
    CreateGroupChat(InputChat: inputGroupChat): Chat
`;
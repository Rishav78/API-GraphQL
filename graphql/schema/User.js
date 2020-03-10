exports.User = `
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
`;

exports.UserMutations = `
    AddFriend(friendId: ID!): Error!
    RemoveFriend(friendId: ID!): Error!
`;

exports.UserQuries = `
    users: [User!]!
    userById(_id: ID): User
`;

exports.InputUser = `
    input inputUser {
        firstname: String!
        lastname: String!
        email: String!
        password: String!
    }
`
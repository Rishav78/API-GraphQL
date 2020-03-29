exports.User = `
    type User {
        _id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password: String
        friends: [User!]
        activeChats: [Chat!]
        status: Boolean!
        updatedAt: String!
        createdAt: String!
    }
    type Users {
        err: String
        users: [User!] 
    }
`;

exports.UserMutations = `
    AddFriend(friendId: ID!): Error!
    RemoveFriend(friendId: ID!): Error!
`;

exports.UserQuries = `
    users: Users!
    user(_id: ID): User
`;
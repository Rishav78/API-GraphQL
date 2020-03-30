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
    insertUser(name: String!, image: String): Error!
    updateUser(name: String, image: String): Error!
`;

exports.UserQuries = `
    user(phone: String!): Error!
`;
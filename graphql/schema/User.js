exports.User = `
    type User {
        number: String
        countrycode: String
        name: String
        status: String
        err: String
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
    user(phone: String!): User!
`;
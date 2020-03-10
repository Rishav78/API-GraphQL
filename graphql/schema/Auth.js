exports.Auth = `
    type AuthData {
        token: String!
        expiresIn: Int!
    }
`;

exports.AuthQuries = `
    login(email: String!, password: String!): AuthData!
`;

exports.AuthMutations = `
    CreateUser(InputUser: inputUser): User
`;
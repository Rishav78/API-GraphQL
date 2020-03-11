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

exports.InputUser = `
    input inputUser {
        firstname: String!
        lastname: String!
        email: String!
        password: String!
    }
`
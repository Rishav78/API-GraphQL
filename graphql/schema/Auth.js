exports.Auth = `
    type AuthData {
        err: String
        token: String
        expiresIn: Int
    }
    type CurrentUser {
        user: User
        err: String 
    }
`;

exports.AuthQuries = `
    login(email: String!, password: String!): AuthData!
    currentUser: CurrentUser
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
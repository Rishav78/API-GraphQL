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
    currentUser: User!
`;

exports.AuthMutations = `
    login(phone: String!): Error!
    logout: Error!
    verifyUser(otp: String!, phone: String!): AuthData!
`;

exports.InputUser = `
`
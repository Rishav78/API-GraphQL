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
    currentUser: CurrentUser
`;

exports.AuthMutations = `
    login(phone: String!): Error!
    verifyUser(otp: String!): AuthData
`;
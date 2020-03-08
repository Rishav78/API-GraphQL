const jwt = require('jsonwebtoken');

exports.validToken = (Token) => {
    if(!Token) return { 'authenticated': false };
    try {
        const user = jwt.verify(Token, 'secretKey');
        return { authenticated: true, user };
    } catch(err) {
        return { authenticated: false };
    }
}
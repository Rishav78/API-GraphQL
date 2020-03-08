const jwt = require('jsonwebtoken');

exports.validToken = (Token) => {
    if(!Token) return { 'authenticated': false };
    try {
        const user = jwt.verify(Token, process.env.JSON_WEB_TOKEN_KEY);
        return { authenticated: true, user };
    } catch(err) {
        return { authenticated: false };
    }
}
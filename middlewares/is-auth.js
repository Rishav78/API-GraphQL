const jwt = require('jsonwebtoken');

module.exports = () => {
    return function(req, res, next) {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            req.isAuth = false;
            return next();
        }
        const [barrer, token] = authHeader.split(' ');
        if ( !token || token === '') {
            req.isAuth = false;
            return next();
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JSON_WEB_TOKEN_KEY);
            if ( !decodedToken ) {
                req.isAuth = false;
                return next();
            }
            req.isAuth = true;
            req.userId = decodedToken.number;
            return next();
        }
        catch (err) {
            console.log(err);
            req.isAuth = false;
            return next();
        }
    }
}
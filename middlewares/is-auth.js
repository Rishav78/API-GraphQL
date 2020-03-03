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
            req.isAuth = false;
            req.userId = decodedToken._id;
            return next();
        }
        catch (err) {
            req.isAuth = false;
            return next();
        }
    }
}
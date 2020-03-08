const services = require('../services');
const auth = require('../auth/is-auth');

exports.update = async data => {
    const { Token } = data;
    const { authenticated } = auth.validToken(Token);
    if(!authenticated) return { authenticated };

    const { user, msg } = data;
    const { _id:userid } = user;
    const { _id } = msg;

    const res = await services.messages.updateMessage(_id, userid);
    return res;
}

exports.save = async data => {
    const { Token } = data;
    const { authenticated, user} = auth.validToken(Token);
    if(!authenticated) return cb({ authenticated });

    const { _id, message } = data;
    const msg = await services.messages.saveMessage(_id, message, user._id);
    return { ...msg, _id, authenticated };
}
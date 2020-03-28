const user = require('../../models/usersinfo');

const users = async ids => {
    const usrs = await user.find({_id: { $in: ids }}, { password: 0 });
    return usrs.map( usr => ({ ...usr._doc, friends: users.bind(this, usr.friends )}));
}

const asyncIterator = (items, cb, i=0) => {
    cb(items[i]);
    setTimeout(() => asyncIterator(items, cb, i+1), 5);
}

module.exports = {
    users,
    asyncIterator
};
const userinfo = require('../../models/usersinfo');

module.exports = {
    AddFriend: async (args, req) => {
        const { friendId } = args;
        const { userId } = req;
        try {
            await userinfo.findByIdAndUpdate(userId, { $push: { friends: friendId } });
            await userinfo.findByIdAndUpdate(friendId, { $push: { friends: friendId } });
            return { sucess: true };
        }
        catch (err) {
            return { sucess: false, msg: err.message };
        }
    },
    RemoveFriend: async (args, req) => {
        const { friendId } = args;
        const { userId } = req;try {
            await userinfo.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
            await userinfo.findByIdAndUpdate(friendId, { $pull: { friends: friendId } });
            return { sucess: true };
        }
        catch (err) {
            return { sucess: false, msg: err.message };
        }
    }
}
const userinfo = require('../../models/usersinfo');

module.exports = {
    AddFriend: async (args, req) => {
        const { friendId } = args;
        const { isAuth, userId } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const friends = await userinfo.findOne({ _id: userId, friends: friendId });
            if (!!friends) {
                throw new Error('both users are already friends')
            }
            await userinfo.findByIdAndUpdate(userId, { $push: { friends: friendId } });
            await userinfo.findByIdAndUpdate(friendId, { $push: { friends: userId } });
            return { success: true };
        }
        catch (err) {
            return { success: false, err: err.message };
        }
    },
    RemoveFriend: async (args, req) => {
        const { friendId } = args;
        const { isAuth, userId } = req;
        try {
            if (!isAuth) {
                throw new Error('unauthrized');
            }
            const friends = await userinfo.findOne({ _id: userId, friends: friendId });
            if (!friends) {
                throw new Error('users are not friends')
            }
            await userinfo.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
            await userinfo.findByIdAndUpdate(friendId, { $pull: { friends: friendId } });
            return { success: true };
        }
        catch (err) {
            return { success: false, err: err.message };
        }
    }
}
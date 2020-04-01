//@ts-check
const services = require('../services');

const AsyncIterator = (items, cb, i = 0) => {
  if (i < items.length) {
    setTimeout(() => cb(items[i], i), 5);
    setTimeout(() => AsyncIterator(items, cb, i + 1), 5);
  }
}

exports.updateReceiveBy = (io, authdata, connected) => {
  return async function (data, cb) {
    try {
      const { messageId } = data;
      const { message, success } = await services.message.updateReceivedBy(messageId, authdata._id);
      const { sender } = message;
      const socketid = connected[sender._id];
      return io.to(socketid).emit('update-message-information', message);
    }
    catch (err) {

    }
  }
}

exports.updateSeenBy = (io, authdata, connected) => {
  return async function (data, cb) {
    try {
      const { messageId } = data;
      const { message, success } = await services.message.updateSeenBy(messageId, authdata._id);
      const { sender } = message;
      const socketid = connected[sender._id];
      return io.to(socketid).emit('update-message-information', message);
    }
    catch (err) {

    }
  }
}

exports.sendMessage = (io, connected) => {
  return function (data, cb) {
    setTimeout(() =>
      AsyncIterator(data.chat.members, (item, i) => {
        console.log(item);
        const memberKey = `+${item.countrycode}${item.number}`;
        if (!connected[memberKey]) return;
        io.to(connected[memberKey]).emit('new-message', data);
      }));
  }
}


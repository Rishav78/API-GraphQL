const AsyncIterator = (items, cb, i = 0) => {
  if (i < items.length) {
    setTimeout(() => cb(item[i], i), 5);
    setTimeout(() => AsyncIterator(items, cb, i + 1), 5);
  }
}

exports.createGroup = (io, connected) => {
  return function (data, cb) {
    const ownerKey = `+${data.owner.countrycode}${data.owner.number}`;
    setTimeout(() =>
      AsyncIterator(data.members, (item, i) => {
        const memberKey = `+${item.countrycode}${item.number}`;
        if (ownerKey === memberKey || !connected[memberKey]) return;
        io.to(connected[memberKey]).emit('new-group', data);
      }), 5);
    cb({ success: true });
  }
}
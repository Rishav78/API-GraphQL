const AsyncIterator = (items, cb, i = 0) => {
  if (i < items.length) {
    setTimeout(() => cb(items[i], i), 5);
    setTimeout(() => AsyncIterator(items, cb, i + 1), 5);
  }
}

exports.createGroup = (io, connected) => {
  return function (data, cb) {
    const ownerKey = `+${data.group.owner.countrycode}${data.group.owner.number}`;
    setTimeout(() =>
      AsyncIterator(data.members, (item, i) => {
        console.log(item);
        const memberKey = `+${item.countrycode}${item.number}`;
        if (ownerKey === memberKey || !connected[memberKey]) return;
        io.to(connected[memberKey]).emit('new-group', data);
      }), 5);
    cb(null, data);
  }
}
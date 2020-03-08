const whitelist = ['http://localhost:3000', 'http://localhost:5000'];
const corsOptions = {
  credentials: true, // This is important to receive credentials.
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

module.exports = corsOptions;
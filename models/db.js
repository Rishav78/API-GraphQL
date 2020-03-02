const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB}`, 
    { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (err) => {
    throw err;
});

module.exports = mongoose;
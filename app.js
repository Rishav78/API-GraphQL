if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT;
const app = express();

// MongoDB Config
require('./models/db');

app.use('/graphql', graphqlHttp({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolvers'),
    graphiql: true
}));

app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
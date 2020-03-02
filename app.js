if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const PORT = process.env.PORT;
const app = express();

// MongoDB Config
require('./models/db');

app.use(express.json());

app.use('/graphql', graphqlHttp({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolvers'),
    graphiql: true
}));

app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
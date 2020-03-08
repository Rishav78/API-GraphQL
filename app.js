if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const httpServer = require('http').createServer(app);
const PORT = process.env.PORT;
const auth = require('./middlewares/is-auth');
const corsOptions = require('./lib/cors');

// MongoDB Config
require('./config/db');

// SocketIO Config
require('./socket.io')(httpServer);

// Middlewears
app.use(express.json()); //JSON parser

app.use(auth()); // User authentication

app.use(morgan('tiny')); // display logs

app.use(cors(corsOptions)); // handle cors request

app.use('/graphql', graphqlHttp({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolvers'),
    graphiql: true
})); // graphql route

httpServer.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));

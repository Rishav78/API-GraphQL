if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();
const httpServer = require('http').createServer(app);
const PORT = process.env.PORT || 8000;
const auth = require('./middlewares/is-auth');
const corsOptions = require('./lib/cors');
const routes = require('./routes');

// MongoDB Config
require('./config/db');

// SocketIO Config
require('./socket.io')(httpServer);

// app.use(express.static(path.join(__dirname, 'static')));

// Middlewears
app.use(express.json()); //JSON parser

app.use(auth()); // User authentication

app.use(morgan('tiny')); // display logs

app.use(cors(corsOptions)); // handle cors request

app.use(routes); // handle routes

app.use('/graphql', graphqlHttp({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolvers'),
    graphiql: true
})); // graphql route

httpServer.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));

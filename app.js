if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema  } = require('graphql');
const PORT = process.env.PORT;
const app = express();

const schema = buildSchema(`
    type RootQuery {
        events: [String!]!
    }

    type RootMutation {
        createEvent(name: String): String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)

app.use('/graphql', graphqlHttp({
    schema,
    rootValue: {
        events: () => ['1', '2'],
        createEvent: (args) => args.name
    },
    graphiql: true
}));

app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
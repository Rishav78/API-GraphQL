if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema  } = require('graphql');
const PORT = process.env.PORT;
const app = express();

const messages = []


//receivedby: [MessageReceivedBy!]!

const messangerSchema = buildSchema(`
    type MessageReceivedBy {
        _id: ID!
        seen: Boolean!
        user: ID!
    }

    type Message {
        _id: ID!
        sender: ID!
        message: String!
        createdAt: String!
        updatedAt: String!
    }

    input InputMessage {
        sender: ID!
        message: String!
    }

    type RootQuery {
        messages: [Message!]!
    }

    type RootMutation {
        createMessage(inputMessage: InputMessage): Message
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

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
    schema: messangerSchema,
    rootValue: {
        messages: () => messages,
        createMessage: (args) => {
            const { inputMessage } = args;
            const message = {
                ...inputMessage,
                _id: Math.random().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            messages.push(message);
            return message;
        }
    },
    graphiql: true
}));

app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
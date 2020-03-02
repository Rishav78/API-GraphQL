if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema  } = require('graphql');
const PORT = process.env.PORT;
const app = express();

// MongoDB Config
require('./models/db');

//Models
const message = require('./models/messages');
const user = require('./models/users');


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
        receivedby: [MessageReceivedBy!]!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        firstname: String!
        lastname: String!
    }

    input messageReceivedBy {
        seen: Boolean!
        user: ID!
    }

    input inputMessage {
        sender: ID!
        message: String!
        receivedby: [messageReceivedBy]!
    }

    type RootQuery {
        messages: [Message!]!
        message(_id: ID): Message
        users: [User!]!
    }

    type RootMutation {
        createMessage(InputMessage: inputMessage): Message
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

app.use('/graphql', graphqlHttp({
    schema: messangerSchema,
    rootValue: {
        messages: async _ => {
            const messages = await message.find({});
            return messages;
        },
        users: async _ => {
            const users = await user.find({});
            return users;
        }, 
        message: async args => {
            const { _id } = args;
            console.log(_id)
            const msg = await message.findById(_id);
            return msg;
        },
        createMessage: async (args) => {
            const { InputMessage } = args;
            const msg = new message({...InputMessage});
            return (await msg.save());
        }
    },
    graphiql: true
}));

app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema  } = require('graphql');
const bcrypt = require('bcryptjs');
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
        phone: String!
        password: String
        friends: [User!]!
        activeChats: [ID!]!
        status: Boolean!
        updatedAt: String!
        createdAt: String!
    }

    input inputUser {
        firstname: String!
        lastname: String!
        phone: String!
        password: String!
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
        userById(_id: ID): User
    }

    type RootMutation {
        createMessage(InputMessage: inputMessage): Message
        createUser(InputUser: inputUser): User
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
            try {
                const messages = await message.find({});
                return messages;
            } 
            catch (err) {
                console.log(err.message);
            }
        },
        users: async _ => {
            try {
                const users = await user.find({}, { password: 0 })
                    .populate('friends', { password: 0 });

                return users;
            }
            catch (err) {
                console.log(err);
            }
        },
        userById: async args => {
            const { _id } = args;
            const usr = await user.findById(_id).populate('friends').populate('activeChats');
            console.log(usr);
            return usr;
        },
        createUser: async args => {
            const { password:pswd, ...restInfo } = args.InputUser;
            try {
                const exists = await user.findOne({ phone: restInfo.phone });
                if ( exists ) {
                    throw Error('user already exists');
                }
                const password = await bcrypt.hash(pswd, 12);
                const newUser = new user({
                    ...restInfo, 
                    password,
                    activeChats: [],
                    friends: [],
                    status: false
                });
                const usr = await newUser.save();
                return usr;
            }
            catch (err) {
                throw err;
            }
        },
        message: async args => {
            const { _id } = args;
            try {
                const msg = await message.findById(_id);
                return msg;
            }
            catch (err) {
                console.log(err);
            }
        },
        createMessage: async (args) => {
            const { InputMessage } = args;
            try {
                const msg = new message({...InputMessage});
                return (await msg.save());
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    graphiql: true
}));

app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
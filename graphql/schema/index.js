const { buildSchema  } = require('graphql');
const { 
    InputUser,
    Auth, 
    AuthMutations, 
    AuthQuries } = require('./Auth');

const { 
    Chat, 
    ChatMutations, 
    ChatQuries, 
    InputChat } = require('./Chat');

const { Error } = require('./Error');

const { 
    InputMessage, 
    Message, 
    MessageMutations, 
    MessageQuries } = require('./Message');

const { 
    User, 
    UserMutations, 
    UserQuries } = require('./User');

module.exports = buildSchema(`

    ${Error}
    
    ${Auth}

    ${Chat}

    ${Message}

    ${User}

    ${InputChat}

    ${InputMessage}

    ${InputUser}
    

    type RootQuery {
        ${AuthQuries}
        ${ChatQuries}
        ${MessageQuries}
        ${UserQuries}
    }

    type RootMutation {
        ${AuthMutations}
        ${ChatMutations}
        ${MessageMutations}
        ${UserMutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
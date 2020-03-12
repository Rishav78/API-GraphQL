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

const { Error: Err } = require('./Error');
const { Media } = require('./Media');

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

    ${Err}
    
    ${Auth}

    ${Chat}

    ${Message}

    ${Media}

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
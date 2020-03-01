if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

const express = require('express');
const PORT = process.env.PORT;
const app = express();



app.use(express.json());


app.listen( PORT, () => console.log(`Listening on PORT ${PORT}`));
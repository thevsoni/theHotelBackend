const express = require('express');
require("dotenv").config();
const cors = require('cors');

const app = express();

//connect to mongodb
const dbconfig = require('./db');

app.use(cors());
//to collect request and its body in json form
app.use(express.json());

//connect with routes
app.use('/api/rooms', require('./routes/roomsRoute'));

app.use('/api/users', require('./routes/usersRoute'));

app.use('/api/bookings', require('./routes/bookingsRoute'));



// const port = 5000;
const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`The Room app listening on port ${port} and site at http://localhost:${port}`)
})

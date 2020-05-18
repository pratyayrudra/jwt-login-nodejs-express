require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const fs = require('fs') //logging
const morgan = require('morgan'); //logging

const helmet = require('helmet'); //security
const cors = require('cors'); //cross origin resource security

const Authenticate = require('./routes/Authenticate'); //routes

const app = express();

var accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })
app.use(morgan('[:date[iso]] - :remote-addr ":method :url" :status :res[content-length] - ":response-time ms" - ":user-agent"', { stream: accessLogStream }));

app.use(helmet())
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err)
        console.log("DB Connected")
    else
        console.log("DB Not Connected")
})

app.use('/', Authenticate)

const port = process.env.PORT

app.listen(port, () => {
    console.log("Server started at " + port)
})
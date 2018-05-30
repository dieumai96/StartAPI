const express = require("express");

const path = require('path');
const cookidParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
}))

const mongoose = require('mongoose');
mongoose.connect('mongodb://dieumai96:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-8zgok.mongodb.net:27017,node-rest-shop-shard-00-01-8zgok.mongodb.net:27017,node-rest-shop-shard-00-02-8zgok.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin');
const passport = require('passport');
const session = require('express-session');

app.use(passport.initialize());
app.use(passport.session());
require('./passport');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookidParser());
app.use('/users', userRoutes);
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;
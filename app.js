var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var cors = require('cors')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('trust proxy', 1); //needed when deploying online
app.enable('trust proxy'); //needed when deploying online


app.use(
    cors({
        origin: ['http://localhost:3000']  // <== URL of our future React app
    })
)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);


mongoose
    .connect(process.env.MONGODB_URI)
    .then(x => {
        console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
    })
    .catch(err => {
        console.log(`An error occurred while connecting to the Database: ${err}`);
    });

module.exports = app;

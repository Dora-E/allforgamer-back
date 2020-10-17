require("dotenv").config();
require("./config/mongo");
const createError = require('http-errors');
const express = require('express');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");

const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games');
const commentairesRouter = require('./routes/commentaires');
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const app = express();
const hbs = require('hbs')
var cors = require('cors')




app.use(cors(['https://git.heroku.com/afgback.git', 'https://git.heroku.com/allforgamers.git']))

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.set('view engine', 'hbs');
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60000
    }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: false,
  })
);

app.get("/", (req, res) => res.send("afg backend is running !"));
//console.log("foo");
//console.log("foo");


app.use('/users', usersRouter);
app.use('/games', gamesRouter);
app.use('/', require("./routes/auth"));
app.use('/commentaires', commentairesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
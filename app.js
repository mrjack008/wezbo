var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var db = require('./config/connection')
var session = require('express-session')
var nocache = require('nocache')
var app = express();


hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(nocache())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(session({ secret: 'hai', cookie: { maxAge: 600000 },resave:false,saveUninitialized:true, }));

db.connect((err)=>{
  if(err) console.log("connection error"+err);
  else console.log("Database connected to port 27017");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

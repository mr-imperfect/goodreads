var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileupload=require('express-fileupload')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Fuse = require('fuse.js')
var db=require('./connection/connection')
var app = express();
var hbs=require('express-handlebars')
var session=require('express-session')
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views'}))
app.use(session({secret:"greads",cookie:{maxAge:600000}}))
app.use(logger('dev'));
app.use(express.json());
// app.use(fuse())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileupload())
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
  if(err){
    throw err
  }else{
    console.log("database connected successfully..");
  }
})
// app.use('/', indexRouter);
app.use('/', usersRouter);

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

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var $ = require('jquery');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);
//lam gio hang su dung connect-mongo
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth')(passport);

var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost/nodejs_shoppingcart',{useNewUrlParser: true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
   secret: ' thesecret', 
   resave: false,  
   saveUninitialized: false,
   //setup lam gio hang
   store: new MongoStore({ mongooseConnection: mongoose.connection }),
   cookie: {maxAge: 180 * 60 * 1000}
  }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));
app.use("/stylesheets",express.static(__dirname + "/stylesheets"));
app.use("/javascripts",express.static(__dirname + "/javascripts"));
app.use("/images",express.static(__dirname + "/images"));
app.use("/admin",express.static(__dirname + "/admin"));
app.use(require('flash')());
 
app.use(passport.initialize());
app.use(passport.session());
//xu ly giao dien sau khi dang nhap
app.get('*',function(req, res, next ){
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
});

app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/auth', authRouter);




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

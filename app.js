//mongo db
var { JWT_SECRET } = require('./config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');  // ← DODAJ

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var galleriesRouter = require('./routes/galleries');
var imagesRouter = require('./routes/images');
var statsRouter = require('./routes/stats');

var app = express();

var jwt = require('jsonwebtoken');

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/GalleryDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Błąd połączenia:', err));





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token

app.use(function(req, res, next) {
  var token = req.cookies.token;
  if (token) {
    try {
      var decoded = jwt.verify(token, JWT_SECRET);
      res.locals.loggedUser = decoded; // dostępne we wszystkich widokach
    } catch (err) {
      res.locals.loggedUser = null;
    }
  } else {
    res.locals.loggedUser = null;
  }
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/galleries', galleriesRouter);
app.use('/images', imagesRouter);
app.use('/stats', statsRouter);

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




//
//app.listen(3000, () => console.log('Server on http://localhost:3000'))


module.exports = app;

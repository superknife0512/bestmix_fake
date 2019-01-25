const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');

const shopRouter = require('./routes/shop');
const adminRouter = require('./routes/admin');
const adminProRouter = require('./routes/products/adminProduct');
const shopProRouter = require('./routes/products/shopProduct');
const authRouter = require('./routes/auth/auth');

const User = require('./models/User');

const app = express();
const URI = process.env.MONGO_CONNECTION_STRING ;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/news', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/news/public', express.static(path.join(__dirname, 'public')));
app.use('/news/public', express.static(path.join(__dirname, 'public')));
app.use('/product/:productType', express.static(path.join(__dirname, 'public')));

app.use('/admin/public', express.static(path.join(__dirname, 'public')));
app.use('/product', express.static(path.join(__dirname, 'public')));
app.use('/product/public', express.static(path.join(__dirname, 'public')));
app.use('/product/:productType/public', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/reset', express.static(path.join(__dirname, 'public')));
app.use('/admin/reply', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'Yasuo ganktem',
  resave:false,
  saveUninitialized: false,  
  cookie:{
    maxAge: 3600000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    stringify: false,
    ttl: 60*60,
  })
}))

app.use(async (req,res,next)=>{
  try{
    if(req.session.user){
      req.user = await User.findById(req.session.user._id);
      res.locals.isLogin = req.session.isLogin;    
      next();    
    } else {
      req.user = null;
      res.locals.isLogin = false;
      next();    
    }
  } catch (err) {
    next(err)
  }
})

app.use(helmet());

app.use(shopRouter);
app.use(authRouter);
app.use('/admin', adminProRouter);
app.use('/admin', adminRouter);
app.use('/product', shopProRouter);


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
  res.render('error',{
    title: 'Errors',
    path: '/error'
  });
});

mongoose.connect(URI, (err)=>{
  if(err){
    console.log(err);
  }
})

module.exports = app;


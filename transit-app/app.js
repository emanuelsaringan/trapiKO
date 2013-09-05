
/**
 * Module dependencies.
 */
var HOST_NAME = 'localhost';
var WEB_APP_PORT = 3000;
var DB_PORT = 27017;

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , NodeUtils = require('./node-utils').NodeUtils;

var app = express();

// Order is important! 
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// mongoose
// mongoose.connect("mongodb://localhost/transit-app");

// var LocalUserSchema = new mongoose.Schema(
//   {
//     username: String,
//     salt: String,
//     hash: String
//   }
// );

// passport
passport.serializeUser(
  function(user, done) {
    done(null, user);
  }
);

passport.deserializeUser(
  function(id, done) {
    // User.findById(id, function(err, user) {
      done(null, { name: 'Jay' });
    // });
  }
);

passport.use(
  new LocalStrategy(
    function(username, password, done) {
      if (username === "test" && password == "test") {
        var userInfo = {
          name: username
        };

        return done(null, userInfo);  
      }

      return done(null, false);
      
      // User.findOne({ username: username }, function (err, user) {
      //   if (err) { return done(err); }
      //   if (!user) {
      //     return done(null, false, { message: 'Incorrect username.' });
      //   }
      //   if (!user.validPassword(password)) {
      //     return done(null, false, { message: 'Incorrect password.' });
      //   }
      //   return done(null, user);
      // });
    }
  )
);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Utility functions
function getUserInfo(req) {
  if (NodeUtils.isEmptyObject(req.session.passport)) {
    return null;
  }

  return {
    name: req.session.passport.user.name
  };
}

// Routes

app.get('/', 
  function(req, res) {
    res.render('index',{
      title: "trapiKO",
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/about', 
  function(req, res) {
    res.render('about',{
      title: "About trapiKO",
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/blog', 
  function(req, res) {
    res.render('blog', {
      title: 'trapiKO Development Blog',
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/contact', 
  function(req, res) {
    res.render('contact', {
      title: 'Contact Us',
      email: 'dev@lambdageek.com',
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/jeeps',
  function(req, res) {
    res.render('jeeps', {
      title: 'Jeepney Overview',
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/voters',
  function(req, res) {
    res.render('voters', {
      title: 'Voter Overview',
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/add_jeep',
  function(req, res) {
    res.render('add_jeep', {
      title: 'Add A Jeep',
      userInfo: getUserInfo(req)
    });
  }
);

app.post('/add_jeep',
  function(req, res) {
    res.redirect('/jeeps');
  }
);

app.get('/prizes',
  function(req, res) {
    res.render('prizes', {
      title: 'Prize Overview',
      userInfo: getUserInfo(req)
    });
  }
);

app.get('/add_prize',
  function(req, res) {
    res.render('add_prize', {
      title: 'Add A Prize',
      userInfo: getUserInfo(req)
    });
  }
);

app.post('/add_prize',
  function(req, res) {
    res.redirect('/prizes');
  }
);

app.post('/login', 
  passport.authenticate('local', 
    {
      successRedirect: '/',
      failureRedirect: '/fail'
    }
  )
);

app.post('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  }
);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

//Socket.IO
var io = require('socket.io').listen(app.listen(WEB_APP_PORT));
console.log("Listening on port " + WEB_APP_PORT);

// Error handling

app.use(app.router);

app.use(
  function(req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
      res.render('404', {url : req.url});
      return;
    }

    if (req.accepts('json')) {
      res.send({error : 'Not founds'});
      return;
    }

    res.type('txt').send('Not foundz');
  }
);

app.use(
  function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {error : err});
  }
);

app.get('/404', 
  function(req, res, next) {
    next();
  }
);

app.get('/403',
  function(req, res, next) {
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
  }
);

app.get('/500',
  function(req, res, next) {
    next(new Error('keyboard cat!'));
  }
);

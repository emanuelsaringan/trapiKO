
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
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , NodeUtils = require('./node-utils').NodeUtils
  , UserProvider = require('./user_provider').UserProvider
  , JeepProvider = require('./jeep_provider').JeepProvider;

var app = express();
var UserProvider = new UserProvider(HOST_NAME, DB_PORT);
var JeepProvider = new JeepProvider(HOST_NAME, DB_PORT);

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
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.locals.user = req.session.passport.user;
    next();
  });
  app.use(app.router);
});

// mongoose
// mongoose.connect('mongodb://localhost/transit-app');
// var Schema = mongoose.Schema;

// //Model
// var JeepSchema = new Schema({
//     plate_num    : String,
//     first_name   : String
// });

// mongoose.model('Jeep', JeepSchema);
// var Jeep = mongoose.model('Jeep');

// passport
passport.serializeUser(
  function(user, done) {
    done(null, user);
  }
);

passport.deserializeUser(
  function(user, done) {
    UserProvider.findUserByUsername(user.username, function(err, user) {
      done(null, user);
    });
  }
);

passport.use(
  new LocalStrategy(
    function(username, password, done) {
      UserProvider.findUserByUsername(username, 
        function (err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          if (user.password != password) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
      });
    }
  )
);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes

app.get('/', 
  function(req, res) {
    res.render('index',{
      title: 'trapiKO'
    });
  }
);

app.get('/about', 
  function(req, res) {
    res.render('about',{
      title: 'About trapiKO'
    });
  }
);

app.get('/blog', 
  function(req, res) {
    res.render('blog', {
      title: 'trapiKO Development Blog'
    });
  }
);

app.get('/contact', 
  function(req, res) {
    res.render('contact', {
      title: 'Contact Us',
      email: 'dev@lambdageek.com'
    });
  }
);

app.get('/jeeps',
  function(req, res) {
    JeepProvider.findAll(
      function(error, results) {
        if (error) {
          res.render('/fail');
        } else { 
          res.render('jeeps', {
            title: 'Jeepney Overview',
            jeeps: results
          });
        }
      }
    );
  }
);

app.get('/voters',
  function(req, res) {
    res.render('voters', {
      title: 'Voter Overview'
    });
  }
);

app.get('/add_jeep',
  function(req, res) {
    res.render('add_jeep', {
      title: 'Add A Jeep'
    });
  }
);

app.post('/add_jeep',
  function(req, res) {
    var jeep = {
      plate_num : req.param('plate_num'),
      first_name : req.param('first_name'),
      line : req.param('line')
    };

    JeepProvider.add(jeep, 
      function(error, result) {
        if (error) {
          res.redirect('/fail');
        } else {
          res.redirect('/jeeps');
        }
      }
    );
  }
);

app.get('/prizes',
  function(req, res) {
    res.render('prizes', {
      title: 'Prize Overview'
    });
  }
);

app.get('/add_prize',
  function(req, res) {
    res.render('add_prize', {
      title: 'Add A Prize'
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

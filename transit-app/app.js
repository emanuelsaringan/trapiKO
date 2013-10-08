
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
  , moment = require('moment')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , NodeUtils = require('./node-utils').NodeUtils
  , UserProvider = require('./user_provider').UserProvider
  , JeepProvider = require('./jeep_provider').JeepProvider
  , VoterProvider = require('./voter_provider').VoterProvider
  , LineProvider = require('./line_provider').LineProvider
  , PrizeProvider = require('./prize_provider').PrizeProvider;

var app = express();
var UserProvider = new UserProvider(HOST_NAME, DB_PORT);
var JeepProvider = new JeepProvider(HOST_NAME, DB_PORT);
var VoterProvider = new VoterProvider(HOST_NAME, DB_PORT);
var LineProvider = new LineProvider(HOST_NAME, DB_PORT);
var PrizeProvider = new PrizeProvider(HOST_NAME, DB_PORT);
var timestamp = moment().format('YYYY-MM-DD hh:mm a');

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
    LineProvider.findAll(
      function(error, line_results) {
        if (error) {
          res.render('/fail');
        } else {
          // Generate line lineLookup
          var lineLookup = {};
          var lineResultsLen = line_results.length;
          for (var i = 0; i < lineResultsLen; i++) {
            var line = line_results[i];
            lineLookup[line._id] = line.name;
          }

          JeepProvider.findAll(
            function(error, jeep_results) {
              if (error) {
                res.render('/fail');
              } else {
                res.render('jeeps', {
                  title: 'Jeepney Overview',
                  jeeps: jeep_results,
                  ts: timestamp,
                  lineLookup: lineLookup
                });
              }
            }
          );
        }
      }
    );
  }
);

app.get('/voters',
  function(req, res) {
    VoterProvider.findAll(
      function(error, results) {
        if (error) {
          res.render('/fail');
        } else {
          res.render('voters', {
            title: 'Voter Overview',
            voters: results,
            ts: timestamp
          });
        }
      }
    );
  }
);

app.get('/lines',
  function(req, res) {
    LineProvider.findAll(
      function(error, results) {
        if (error) {
          res.render('/fail');
        } else {
          res.render('lines', {
            title: 'Line Overview',
            lines: results,
            ts: timestamp
          });
        }
      }
    );
  }
);

app.get('/add_line',
  function(req, res) {
    res.render('add_line', {
      title: 'Add A Line'
    });
  }
);

app.post('/add_line',
  function(req, res) {
    var line = {
      name : req.param('name')
    };

    LineProvider.add(line, 
      function(error, result) {
        if (error) {
          res.redirect('/fail');
        } else {
          res.redirect('/lines');
        }
      }
    );
  }
);

app.get('/add_jeep',
  function(req, res) {
    LineProvider.findAll(
      function(error, results) {
        if (error) {
          res.render('/fail');
        } else {
          res.render('add_jeep', {
            title: 'Add A Jeep',
            lines: results
          });
        }
      }
    );
  }
);

app.post('/add_jeep',
  function(req, res) {
    var jeep = {
      plate_num : req.param('plate_num'),
      first_name : req.param('first_name'),
      last_name: req.param('last_name'),
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
    PrizeProvider.findAll(
      function(error, results) {
        if (error) {
          res.render('/fail');
        } else {
          res.render('prizes', {
            title: 'Prize Overview',
            prizes: results,
            ts: timestamp,
            moment: moment
          });
        }
      }
    );
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
    var prize = {
      name: req.param('name'),
      sponsor: req.param('sponsor'),
      price: req.param('price'),
      desc: req.param('desc'),
      img: req.param('img')
    };

    PrizeProvider.add(prize,
      function(error) {
        if (error) {
          res.redirect('/fail');
        } else {
          res.redirect('/prizes');
        }
      }
    );
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
      res.send({error : 'Not found'});
      return;
    }

    res.type('txt').send('Not found');
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

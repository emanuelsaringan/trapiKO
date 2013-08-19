
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes

app.get('/', 
  function(req, res) {
    res.render('index',{
      title: "trapiKO"
    });
  }
);

app.get('/about', 
  function(req, res) {
    res.render('about',{
      title: "About trapiKO"
    });
  }
);

app.get('/blog', 
  function(req, res) {
    res.render('blog', {
      title: 'trapiKO Blog'
    });
  }
);

app.get('/contact', 
  function(req, res) {
    res.render('contact', {
      title: 'Contact Us'
    });
  }
);

app.get('/jeeps',
  function(req, res) {
    res.render('jeeps', {
      title: 'Jeepney Overview'
    });
  }
);

app.get('/voters',
  function(req, res) {
    res.render('voters', {
      title: 'Voter Overview'
    });
  }
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

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

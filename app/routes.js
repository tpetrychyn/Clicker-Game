// app/routes.js
module.exports = function(app, passport) {
  var game = require('./servergame.js')

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/game', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/game', isLoggedIn, function(req, res) {
        res.render('game.ejs', {
            user : req.user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.post('/game/save', isLoggedIn, function(req, res, next) {
      req.user.stats.rocksUnlocked = req.param('rocks');
      req.user.stats.points = req.param('points');
      req.user.save(function(err) {
          if (err)
              throw err;
          res.send('');
      });
    });

    app.get('/game/buyPickaxe', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var points = user.stats.points;
      var id = req.param('id');
      if (points >= getPickaxeCost(id)) {
        user.stats.points -= getPickaxeCost(id);
      }
      req.user.save(function(err) {
          if (err)
              throw err;
          res.send(user.stats.points + "");
      });
    });

    function getPickaxeCost(id) {
      return game.clickerUpgrades[id].cost;
    }

    app.get('/game/chooseRock', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var urocks = user.stats.rocksUnlocked;
      var id = req.param('id');
      if (0 <= game.rockTypes[id].required) {
          req.user.save(function(err) {
              if (err)
                  throw err;
              res.send(req.param('id'));
          });
      } else {
        res.send('notunlocked');
      }
    });

    app.get('/game/mineRock', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var urocks = user.stats.rocksUnlocked;
      var id = req.param('id');
      if (id <= urocks) {
        user.stats.exp += game.rockTypes[id].exp;
          req.user.save(function(err) {
              if (err)
                  throw err;
              res.send(req.param('id') + ' ' + user.stats.exp);
          });
      } else {
        res.send('notunlocked');
      }
    });

    app.get('/game/levelup', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var id = req.param('id');
      var level = user.stats.level;
      console.log(user.stats.exp);
      console.log(user.stats.level + 300 * Math.pow(2,level/7));
      console.log(user.stats.level);
      if (user.stats.exp >= Math.floor(user.stats.level-1 + 300 * Math.pow(2,level-1/7.)) + Math.floor(user.stats.level + 300 * Math.pow(2,level/7.))) {
        user.stats.level++;
        req.user.save(function(err) {
              if (err)
                  throw err;
              res.send(user.stats.level + '');
          });
      } else {
        res.send('notunlocked');
      }
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

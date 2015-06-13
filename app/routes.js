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

    app.get('/game/listRocks', isLoggedIn, function(req, res) {
        res.render('listRocks.ejs', {
            user : req.user,
            layout: false
        });
    });

    app.get('/game/listPicks', isLoggedIn, function(req, res) {
        res.render('pickaxes.ejs', {
            user : req.user,
            layout: false
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/game/buyPickaxe', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var gold = user.stats.gold;
      var id = req.param('id');
      var owned = false;
      if (user.stats.pickaxes.indexOf(id) >= 0) {
          owned = true;
      }
      if (!owned && gold >= getPickaxeCost(id)) {
        user.stats.gold -= getPickaxeCost(id);
        user.stats.pickaxes.push(id);
        user.stats.pickaxes.sort();
      }
      req.user.save(function(err) {
          if (err)
              throw err;
          res.send(user.stats.gold + "");
      });
    });

    function getPickaxeCost(id) {
      return game.pickTypes[id].cost;
    }

    app.get('/game/choosePick', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var id = req.param('id');
      var owned = false;
      if (user.stats.pickaxes.indexOf(id) >= 0) {
          owned = true;
      }
      if (owned) {
          req.user.save(function(err) {
              if (err)
                  throw err;
              res.send(req.param('id'));
          });
      } else {
        res.send('notunlocked');
      }
    });

    app.get('/game/chooseRock', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var urocks = user.stats.rocksUnlocked;
      var id = req.param('id');
      if (user.stats.level >= game.rockTypes[id].required) {
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
      var pick = req.param('pick');
      var level = req.param('level');
      var levelFactor = (10-(0.1*level));
      if (rockTypes[id].required <= user.stats.level && user.stats.level == level && user.stats.pickaxes.indexOf(pick) >= 0) {
          var miningTime = rockTypes[id].mineTime + (Math.random() * levelFactor) - parseInt(pick+1);
          if (miningTime < 1)
            miningTime = (Math.random() * 2) + 1;
          setTimeout(function() {
              user.stats.exp += game.rockTypes[id].exp + 1000;
              user.stats.gold += game.rockTypes[id].cost;
                 req.user.save(function(err) {
                     if (err)
                         throw err;
                     res.send(req.param('id') + ' ' + user.stats.exp);
                 });
          }, miningTime * 1000);
      } else {
        res.send('notunlocked');
      }
    });

    function expForLevel(theLevel) {
        var a = 0;
        for (x=1;x<theLevel;x++) {
            a += Math.floor((x + 300 * Math.pow(2, (x/7.)))/4);
        }
        return a;
    }

    app.get('/game/levelup', isLoggedIn, function(req, res, next) {
      var user = req.user;
      var id = req.param('id');
      var level = user.stats.level;
      if (user.stats.exp >= user.stats.level+1) {
        user.stats.level++;
        for (i in game.rockTypes) {
            if (user.stats.level == game.rockTypes[i].required) {
                user.stats.rocksUnlocked = i;
            }
        }
        req.user.save(function(err) {
              if (err)
                  throw err;
              res.send(user.stats.level + ' ' + user.stats.rocksUnlocked);
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

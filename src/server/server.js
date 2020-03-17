//npm i express dotenv passport passport-auth0 express-session massive
// to install all the server dependencies

//set server parts first, then test to make sure it works.
//next, if using authentication, set up passport 

//require what we need
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , massive = require('massive')
  , bcrypt = require('bcrypt');

//deconstruct the data from the .env file
const {
  SERVER_PORT,
  SESSION_SECRET,
  CONNECTION_STRING,
} = process.env;

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
});

const app = express(); //server

// set our application port
app.set('port', SERVER_PORT);

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    console.log("logged in")
    // res.redirect('/dashboard');
  } else {
    next();
  }
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});


// route for user signup
app.post('/signUp', (req, res) => {
  //create a new user
  const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
  const db = app.get('db');
  db.create_user([req.body.firstName, req.body.lastName, req.body.email, hashedPassword]).then((user) => {
    req.session.user = user;
    res.json({ signedIn: true });
  });
});



// route for user Login
app.post('/signIn', (req, res) => {
  console.log(req.body)
  const db = app.get('db');
  db.find_user([req.body.email]).then((user) => {
    if (user.length === 0) {
      console.log('unknown user name');
      res.redirect('/signIn');
    } else {
      bcrypt.compare(req.body.password, user[0].hashed_password, (err, data) => {
        if (err) throw err;
        if (data) {
          res.json({ signedIn: true });
        } else {
          res.json({ signedIn: false });
        }
      });

    }
  });
});


// route for user's dashboard
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.sendFile(__dirname + '/public/dashboard.html');
  } else {
    res.redirect('/login');
  }
});


// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(SERVER_PORT, () => {
  console.log('FYF is on the air listening to port: ', SERVER_PORT);
})
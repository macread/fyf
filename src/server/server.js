const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , LocalStrategy = require('passport-local')
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

// initialize body-parser to parse incoming parameters requests to req.body need to be huge to handle pictures
app.use(bodyParser.json({ limit: '2000000kb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '2000000kb', extended: true }));

//setup sessions
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport
// - setup authorization strategy
passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
    (req, username, password, done) => {
      const db = app.get('db');
      db.find_user(username).then((user) => {
        if (user[0]) {
          bcrypt.compare(password, user[0].hashed_password, (err, data) => {
            if (err) throw err;
            if (data) done(null, user[0].id); //just want to save the ID to save memory
          });
        } else {
          //create a new user
          const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
          db.create_user([req.body.firstName, req.body.lastName, username, hashedPassword]).then((createdUser) => {
            done(null, createdUser[0].id) //save the new id
          }

          )
        }
      })
    }
  )
)

//serialize and deserialize sets up sessions
// serializeUser gets called on log in and decides what is stored in 
// in session
passport.serializeUser((primaryKeyID, done) => {
  done(null, primaryKeyID)
})

// deserizeUser runs everytime fetches what is stored in sessions
// and puts it in req.user
passport.deserializeUser((primaryKeyID, done) => {
  app.get('db').find_session_user([primaryKeyID]).then(user => {
    done(null, user[0])
  })
})

//passport
//setup authorization endpoints
app.post('/signUp', passport.authenticate('local', {}),
  (req, res) => {
    res.json({ signedIn: true });
  }
);

app.post('/signIn', passport.authenticate('local', {}),
  (req, res) => {
    res.json({ signedIn: true });
  }
);

app.post('/addPicture', (req, res) => {
  const db = app.get('db');
  db.insert_picture([req.user.id, req.body.uploadDate, req.body.title, req.body.description, req.body.picture]).then(() => {
    res.status(200)
  });
});

app.get('/getAllPictures', (req, res) => {
  const db = app.get('db');
  db.get_all_pictures().then((pictures) => {
    res.status(200).send(pictures);
  });
});

app.put('/updateTitle', (req, res) => {
  const db = app.get('db');
  db.update_title(req.body.pictureId, req.body.title).then(() => {
    res.status(200);
  });
});

// start the express server
app.listen(SERVER_PORT, () => {
  console.log('FYF is on the air and listening to port:', SERVER_PORT);
})
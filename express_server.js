const bodyParser = require("body-parser");
const express = require('express');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const {generateRandomString, urlsPerUser, findUserByEmail} = require('./helpers');

const app = express();
const PORT = 8080;

// MIDDLEWARE---------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'user_id',
  keys: ['key1', 'key3', 'key4']
}));
app.set('view engine', 'ejs');
app.use(morgan('dev'));

// DATABASES---------------
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "aJ48lW"},
};

const users = {
  abcd: {
    id: 'abcd',
    email: 'toot@gmail.com',
    password: 'toot',
  }
};
// END OF DATABASES--------

// ROOT PAGE ---------------
app.get('/', (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  res. redirect('/login');
});

// MY URLS FUNCTIONALITY-------------
// rendering /urls page and checks if user is logged in
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsPerUser(req.session.user_id, urlDatabase),
  };

  if (!req.session.user_id)  {
    return res.redirect('/login')
  }

  res.render('urls_index', templateVars);
});

// manages deleting URL from database and checks that user is logged in and owns access to specific urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id;
  let url = urlDatabase[req.params.shortURL];

  if (!user) {
    return res.status(403).send('please log in');
  }

  if (user !== url.userId) {
    res.send('you are not allowed to delete this');
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});
// END OF MY URLS-------------------

// LOGIN/LOGOUT FUNCTIONALITY--------------------
// renders the login page and hands loged in user details to ejs file
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase,
  };
  
  res.render('login', templateVars);
});

// manages checking for correct login credentials
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const account in users) {
    if (bcrypt.compareSync(password, users[account].password) && findUserByEmail(email, users)) {
      req.session.user_id = account;
      return res.redirect('/urls');
    }
  }

  res.status(403).send('Incorrect login information, please try again');
});

// logs user out by removing cookie 
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('urls/');
});
//END OF LOGIN/LOGOUT-------------

//REGISTRATION PAGE-----------------
// renders registration page and hands over logged in user details to ejs file
app.get('/registration', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase,
  };
  
  res.render('registration', templateVars);
});

// handles registering new user along with setting requirements: minimum 8 characters for password, entered password and email and not already registered
app.post('/registration', (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const newId = generateRandomString();

  if (!email || !req.body.password) {
    return res.send('sorry seems we are missing some info');
  }

  if(req.body.password.length < 8) {
    return res.send('please choose a password of at least 8 characters')
  }

  if (findUserByEmail(email, users)) {
    return res.send(400, 'Seems you have already registed');
  }

  users[newId] = {id: newId, email, password};
  req.session.user_id = newId;
  res.redirect('/urls');
});
//END OF REGISTRATION PAGE----------

// NEW URLS ------------------------
// renders page for making new short URLS, if user not logged in redirects to login
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };

  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  res.render('urls_new', templateVars);
});

// manages submission from /urls/new, redundant check to see if user are logged in, and creates short url with randomly generated id then redirects
app.post("/urls", (req, res) => {
  const randomId = generateRandomString();

  if (!req.session.user_id) {
    res.status(304).send('please log in to access this feature');
  }

  urlDatabase[randomId] = {longURL: req.body.longURL, userId: req.session.user_id};
  res.redirect(`/urls/${randomId}`);
});

// renders specific short url page plus checks that user is logged in, has permision to view specific shorturl page and that the short url page exsists
app.get('/urls/:shortURL', (req, res) => {
  const cookieId = req.session.user_id;
  const newShortURL = req.params.shortURL;
  const templateVars = {
    shortURL: newShortURL,
    longURL: urlDatabase[newShortURL].longURL,
    user: users[cookieId],
  };

  if (!cookieId) {
    return res.send('Please log in to view urls');
  }

  if (!urlDatabase[newShortURL]) {
    return res.send('This page is unable to be acessed')
  }

  if (cookieId !== urlDatabase[newShortURL].userId) {
    return res.send('you do not have ownership of this short URL');
  }

  res.render('urls_show', templateVars);
});

// manages the submission for changing the long url along with checks user is logged in and has permission
app.post('/urls/:shortURL', (req, res) => {
  const user = req.session.user_id;
  const url = urlDatabase[req.params.shortURL];

  if (!user) {
    res.status(403).send('please make sure to sign in ');
  }

  if (user === url.userId) {
    url.longURL = req.body.longURL;
    return res.redirect('/urls');
  }

  res.redirect(`/urls/${req.params.shortURL}`);
});

// handles the short url link to the long url site which includes checking to see if the inputed long url includes http/s and adds if needed
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  if (!longURL) {
    res.send('Unknown url, please make sure to create url');
  }

  const includesProtocol = longURL.longURL.includes("https://") || longURL.longURL.includes("http://")
  let urlCheck = includesProtocol ? `${longURL.longURL}` : `https://${longURL.longURL}`;
  
  res.redirect(urlCheck);
});
// NEW URLS END------------------------

// sets the port to listen on 
app.listen(PORT, () => {
  console.log(`connected on port: ${PORT}!`);
});

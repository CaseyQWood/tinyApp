const bodyParser = require("body-parser");
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080 ;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set('view engine', 'ejs');

// DATABASE
const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// DATABASE

// MY URLS FUNCTIONALITY-------------
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  }
  res.render('urls_index', templateVars);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});
// END OF MY URLS-------------------

// LOGIN/LOGOUT--------------------
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('urls/')
})
// END OF LOGIN/LOGOUT-------------

//REGISTRATION PAGE-----------------
app.get('/urls/registration', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  }
  res.render('registration', templateVars)
})
// test
app.post('/urls/registration', (req, res) => {
  const email = req.body.email
  const password = req.body.password
// console.log(email)
// console.log(password)
res.redirect('/urls')
})
//END OF REGISTRATION PAGE----------


// NEW URLS ------------------------
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render('urls_new', templateVars);
})

app.post("/urls", (req, res) => {
  let randoSmall = generateRandomString();
  urlDatabase[randoSmall] = req.body.longURL;
  res.redirect(`/urls/${randoSmall}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
     longURL: urlDatabase[req.params.shortURL],
     username: req.cookies["username"]
    };
  res.render('urls_show', templateVars);
})

// Edit LongUrl
app.post('/urls/:shortURL/edit', (req, res) => {
 urlDatabase[req.params.shortURL] = req.body.longURL
 res.redirect(`/urls/${req.params.shortURL}`)
})
// redirect from created page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`http://${longURL}`);
});
// NEW URLS END------------------------


function generateRandomString() {
  return Math.random().toString(36).substr(2, 5);
};

app.listen(PORT, () => {
  console.log(`connected on port: ${PORT}!`);
});

// app.get('/hello', (req, res) => {
//   res.end('<html><body>Hello <b>World</b></body></html>\n')
// })

// app.get('/', (req, res) => {
//   res.send('Hello!\nYou can access other pages through , /urls.json, /hello, /urls')
// });

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase)
// })
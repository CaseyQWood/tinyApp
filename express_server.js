const bodyParser = require("body-parser");
const express = require('express');
const cookieSession = require('cookie-session')
const morgan = require('morgan');
const bcrypt = require('bcrypt')
const {generateRandomString, urlsPerUser, findUserByEmail, findUserById} = require('./helpers')

const app = express();
const PORT = 8080 ;

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'user_id',
  keys: ['key1', 'key3', 'key4']
}))
app.set('view engine', 'ejs');
app.use(morgan('dev'))
// DATABASES
const urlDatabase = { 
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId: "aJ48lW"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "aJ48lW"}
};
const users = {
  abcd: {
    id: 'abcd',
    email: 'toot@gmail.com',
    password: 'toot',
  }
}
// END OF DATABASES

// MY URLS FUNCTIONALITY-------------
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsPerUser(req.session.user_id, urlDatabase),
  };
  if (!req.session.user_id)  { 
    templateVars.urls = {}
  };
  res.render('urls_index', templateVars);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id
  const url = urlDatabase[req.params.shortURL]
  if (user === url.userId) {
    delete url;
  }
  res.redirect('/urls');
});
// END OF MY URLS-------------------

// LOGIN/LOGOUT--------------------
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase,

  };
  res.render('login', templateVars)
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // if (!findUserByEmail(email, users)) { 
  //   return res.redirect(403).send(' seems some of the info you entered is incorrect, please try again and confirm you have registered')
  // }
    for(const account in users) {
      console.log('this is password test:', bcrypt.compareSync(password, users[account].password))
      if (bcrypt.compareSync(password, users[account].password) && findUserByEmail(email, users)) {
        console.log('this is account:', account)
        req.session.user_id = account
        return res.redirect('/urls');
      } 
    }
  res.status(403).send('Incorrect login information, please try again')
})

// logout
app.post('/logout', (req, res) => {
  req.session = null
  res.redirect('urls/')
})
// END OF LOGIN/LOGOUT-------------

//REGISTRATION PAGE-----------------
app.get('/urls/registration', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlDatabase,
    users
  };
  res.render('registration', templateVars);
})

app.post('/urls/registration', (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10)
  if(!email || !password) {
    return res.send('sorry seems we are missing some info')
  }
  // check to see if email already exsists
  // const findUserByEmail = (email, database) => {
  //   for (const acccount in database) {
  //     if (email === database[acccount].email) {
  //       return true
  //     }
  //   }
  // }

  
    if (findUserByEmail(email, users)) {
       return res.send(400, 'Seems you have already registed')
    } 
  const newId = generateRandomString();

  users[newId] = {id: newId, email, password};
  req.session.user_id = newId;
  // console.log('\x1b[41m%s\x1b[0m', 'some string'); 
  res.redirect('/urls');
})
//END OF REGISTRATION PAGE----------


// NEW URLS ------------------------
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  }
  if(!req.session.user_id) {
    return res.redirect('/urls/registration')
  }
  res.render('urls_new', templateVars);
})

app.post("/urls", (req, res) => {
  let randoSmall = generateRandomString();
  urlDatabase[randoSmall] = {longURL: req.body.longURL, userId: req.session.user_id};
  res.redirect(`/urls/${randoSmall}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
     longURL: urlDatabase[req.params.shortURL].longURL,
     user: users[req.session.user_id],
    };
  res.render('urls_show', templateVars);
})

// Edit LongUrl
app.post('/urls/:shortURL/edit', (req, res) => {
  const user = req.session.user_id
  const url = urlDatabase[req.params.shortURL]
  if (user === url.userId) {
    urlDatabase[req.params.shortURL] = req.body.longURL
  } 
 res.redirect(`/urls/${req.params.shortURL}`)
})
// redirect from created page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // this is a ternerary
  let urlCheck = longURL.longURL.includes("https://") || longURL.longURL.includes("http://") ? `${longURL.longURL}` : `https://${longURL.longURL}` 
  res.redirect(urlCheck);
});
// NEW URLS END------------------------



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
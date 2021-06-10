const bodyParser = require("body-parser");
const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const app = express();
const PORT = 8080 ;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
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
// DATABASES

// MY URLS FUNCTIONALITY-------------
app.get('/urls', (req, res) => {
  
  // dry this up
  const urlsPerUser = (user, dataBase) => {
    let newDb = {}
    for (const key in dataBase) {
      console.log('this is key', dataBase[key].userId)
      console.log('this is db:', dataBase[key])
      if (dataBase[key].userId === user) {
        newDb[key] = dataBase[key]
      }
    }
    return newDb
  }


  const templateVars = {
    user: req.cookies['user_id'],
    urls: urlsPerUser(req.cookies['user_id'], urlDatabase),
    users
  }
  if (!req.cookies['user_id'])  { 
    templateVars.urls = {}
  }

  res.render('urls_index', templateVars);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.cookies['user_id']
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
    user: req.cookies['user_id'],
    urls: urlDatabase,
    users
  };
  res.render('login', templateVars)
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(users)
    for(const account in users) {
      if(email !== users[account].email ) {
        res.send('Response: 403. \nNo user found. please register')
       } 
       if(email === users[account].email && password !== users[account].password) {
        res.send('Response: 403. \nIncorrect login information, please try again')
       } 
      if(email === users[account].email && password === users[account].password) {
       res.cookie('user_id', account)
      } 
    }

  res.redirect('/urls');
})

// logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id')
  res.redirect('urls/')
})
// END OF LOGIN/LOGOUT-------------

//REGISTRATION PAGE-----------------
app.get('/urls/registration', (req, res) => {
  const templateVars = {
    user: req.cookies['user_id'],
    urls: urlDatabase,
    users
  };
  res.render('registration', templateVars);
})

app.post('/urls/registration', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.send('sorry seems we are missing some info')
  }
  
  // check to see if email already exsists
  for (const acccount in users) {
    if (email === users[acccount].email) {
      console.log('test')
       return res.send(400, 'Seems you have already registed')
    }
  }

  const newId = generateRandomString();
  users[newId] = {id: newId, email, password};
  res.cookie('user_id', newId);
  res.redirect('/urls');
})
//END OF REGISTRATION PAGE----------


// NEW URLS ------------------------
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: req.cookies['user_id'],
    users
  }
  if(!req.cookies['user_id']) {
    return res.redirect('/urls/registration')
  }
  res.render('urls_new', templateVars);
})

app.post("/urls", (req, res) => {
  let randoSmall = generateRandomString();
  urlDatabase[randoSmall] = {longURL: req.body.longURL, userId: req.cookies['user_id']};
  res.redirect(`/urls/${randoSmall}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
     longURL: urlDatabase[req.params.shortURL].longURL,
     user: req.cookies['user_id'],
     users
    };
  res.render('urls_show', templateVars);
})

// Edit LongUrl
app.post('/urls/:shortURL/edit', (req, res) => {
  const user = req.cookies['user_id']
  const url = urlDatabase[req.params.shortURL]
  if (user === url.userId) {
    urlDatabase[req.params.shortURL] = req.body.longURL
  } 
 res.redirect(`/urls/${req.params.shortURL}`)
})
// redirect from created page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`);
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
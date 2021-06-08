const express = require('express');
const app = express();
const PORT = 8080 ;

app.set('view engine', 'ejs')

// json object 
const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase
  }
  res.render('urls_index', templateVars)
})

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render('urls_show', templateVars)
})




app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n')
})

app.get('/', (req, res) => {
  res.send('Hello!\nYou can access other pages through , /urls.json, /hello')
});

app.listen(PORT, () => {
  console.log(`connected on port: ${PORT}!`)
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
})
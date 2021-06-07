const express = require('express');
const app = express();
const PORT = 8080 ;

app.set('view engine', 'ejs')

// json object 
const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
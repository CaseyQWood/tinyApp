const express = require('express');
const app = express();
const PORT = 8080 ;

const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send('Hello!\nYou can access the url page through , /urls.json')
});

app.listen(PORT, () => {
  console.log(`connected on port: ${PORT}!`)
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase)
})
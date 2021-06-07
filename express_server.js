const express = require('express');
const app = express();
const PORT = 8080 ;

const urlDatabase = { 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  console.log(req)
  res.send('Hello!')
});

app.listen(PORT, () => {
  console.log(`connected on port: ${PORT}!`)
})
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//create a new application
let app = express();

hbs.registerPartials(__dirname + '/views/partials');
//middleware for display
// hbs for handlebars for dynamic templates
app.set('view engine', 'hbs');
// __dirname stores absolute path
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  });
  next();
});

//maintaince middleware
//'next' is never called, so this will overright any
//render request
/*
app.use((req, res, next) => {
  res.render('maintance.hbs');
});
*/

//register helper functions to run in mustache template
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
});

//HTTP get request
//req stores info on headers, body, path
//res is what you send back
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'a winner is you'
  })
});

//additonal route
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

//test bad route
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "Bad Request",
  });
});

//which port am I listening to?
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});

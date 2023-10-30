const path = require('path');

const express = require('express');
const session = require('express-session')
const sessionConfig = require('./config/session')

const mongoDBSessionStore = sessionConfig.createSessionStore(session)


const db = require('./data/database');
const demoRoutes = require('./routes/demo');
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middlewares/auth-middleware')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session(sessionConfig.createSessionConfig(mongoDBSessionStore)))
app.use(authMiddleware);
app.use(demoRoutes);
app.use(authRoutes);

app.use(function(error, req, res, next) {
  res.render('500');
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});

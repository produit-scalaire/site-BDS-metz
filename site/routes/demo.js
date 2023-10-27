const express = require('express');

const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/creer-compte', function (req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: ''
    };
  }
  req.session.input = null;
  res.render('creer_compte', {inputData: sessionInputData});
});

router.get('/connexion', function (req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      password: '',
    };
  }

  req.session.input = null;
  res.render('connexion', {inputData: sessionInputData});
});

router.post('/creer-compte', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;
  const enteredConfirmPassword = userData['confirm-password'];

  if (!enteredEmail ||
    !enteredConfirmEmail ||
    !enteredConfirmPassword ||
    !enteredPassword ||
    enteredPassword < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    enteredPassword !== enteredConfirmPassword ||
    !enteredEmail.includes('@')
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword
    };

    req.session.save(function () {
      res.redirect('/creer-compte')
    });
    return;
  }

  const existingUser = await db.getDb().collection('users').findOne({email: enteredEmail});

  if (existingUser) {
    req.session.inputData = {
      hasError: true,
      message: 'User exists already!',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword
    };
    req.session.save(function () {
      res.redirect('/creer-compte')
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,
  }

  await db.getDb().collection('users').insertOne(user);

  return res.redirect('/connexion');
});

router.post('/connexion', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db.getDb().collection('users').findOne({email: enteredEmail});

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect('/connexion')
    })
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(enteredPassword, existingUser.password);

  if (!passwordsAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect('/connexion')
    })
    return;
  }

  req.session.user = { id: existingUser._id, email: existingUser.email};
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect('/profile');
  });
});
router.get('/profile', function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render('401');
  }
  res.render('profile');
});

router.get('/admin', async function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render('401');
  }
  const user = await db.getDb().collection('users').findOne({_id: req.session.id})
  if (!user || !user.isAdmin) {
    res.status(403).render('403');
  }
  res.render('admin-page');
})

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/');
});

module.exports = router;

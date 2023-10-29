const express = require('express');

const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/creer-compte', function (req, res) {
  var sessionInputData = {
        hasError: false,
        nom: '',
        prenom: '',
        nom_dutilisateur: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: ''
      };
  req.session.input = null;
  res.render('creer_compte', {inputData: sessionInputData});
});

router.get('/connexion', function (req, res) {
  let sessionInputData = req.session.inputData;
  sessionInputData = {
    hasError: false,
    nom_dutilisateur: '',
    password: '',
  }

  req.session.input = null;
  res.render('connexion', {inputData: sessionInputData});
});

router.post('/creer-compte', async function (req, res) {
  const userData = req.body;
  const enteredNom = userData.nom;
  const enteredPrenom = userData.prenom;
  const enteredNom_dutilisateur = userData.nom_dutilisateur;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;
  const enteredConfirmPassword = userData['confirm-password'];

  if (!enteredNom ||
    !enteredPrenom ||
    !enteredNom_dutilisateur ||
    !enteredEmail ||
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
      nom: enteredNom,
      prenom: enteredPrenom,
      nom_dutilisateur: enteredNom_dutilisateur,
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
      nom: enteredNom,
      prenom: enteredPrenom,
      nom_dutilisateur: enteredNom_dutilisateur,
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
    nom: enteredNom,
    prenom: enteredPrenom,
    nom_dutilisateur: enteredNom_dutilisateur,
    email: enteredEmail,
    password: hashedPassword
  }

  await db.getDb().collection('users').insertOne(user);

  return res.redirect('/connexion');
});

router.post('/connexion', async function (req, res) {
  const userData = req.body;
  const enteredNom_dutilisateur = userData.nom_dutilisateur;
  const enteredPassword = userData.password;

  const existingUser = await db.getDb().collection('users').findOne({nom_dutilisateur: enteredNom_dutilisateur});

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in - please check your credentials!',
      nom_dutilisateur: enteredNom_dutilisateur,
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
      nom_dutilisateur: enteredNom_dutilisateur,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect('/connexion')
    })
    return;
  }
  req.session.user = { id: existingUser._id, nom_dutilisateur: existingUser.nom_dutilisateur};
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect('/');
  });
});

router.get('/profile', function(req, res) {
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
  await res.render('admin-page');
})

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/');
});

router.get('/contact', function (req, res) {
  res.render('contact')
})


module.exports = router;

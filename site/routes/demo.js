const express = require('express');

const bcrypt = require('bcryptjs');

const db = require('../data/database');
const Post = require('../models/post')

const router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
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
  const user = await db.getDb().collection('users').findOne({_id: req.session.user.id})
  if (!user || !user.isAdmin) {
    return res.status(403).render('403');
  }

  const users = await db.getDb().collection('users').find().toArray();
  res.render('adminPage', {users: users});
})


router.get('/contact', function (req, res) {
  res.render('contact')
})

router.get('/sports', function (req,res) {
  res.render('sports')
})

router.get('/services', function (req,res) {
  res.render('services')
})

router.get('/team', function (req,res) {
  res.render('team')
})

router.get('/a-propos', function (req,res) {
  res.render('a_propos')
})

module.exports = router;

const path = require('path')

const express = require('express')

const app = express()

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))

app.get('/', function (req, res) {
    const htmlFilePath = path.join(__dirname, 'html', 'index.html')
  res.sendFile(htmlFilePath)
  })

app.get('/Sports', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'Sport.html')
  res.sendFile(htmlFilePath)
  })

app.get('/Contact', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'Contact.html')
  res.sendFile(htmlFilePath)
  })

app.get('/evenement', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'evenement.html')
  res.sendFile(htmlFilePath)
  })

app.get('/Team', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'Team.html')
  res.sendFile(htmlFilePath)
  })

app.get('/A propos', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'A_propos.html')
  res.sendFile(htmlFilePath)
  })

app.get('/connexion', function (req, res) {
  const htmlFilePath = path.join(__dirname, 'html', 'connexion.html')
  res.sendFile(htmlFilePath)
  })


app.post('/connexion', function (req, res) {
  const nom_dutilisateur = req.body.nom_dutilisateur
  const password = req.body.Password
  const filePath = path.join(__dirname, '')
})

app.listen(3000)
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Constants
const MONGODB_URI = 'mongodb://database_user:27017/users';
const DATABASE_NAME = 'users';
const COLLECTION_NAME = 'users';
const PORT = 3000;
const ROLE = {
  USER: 'prof',
  RESPO: 'respo-option',
  ADMIN: 'administrateur',
  SERVICE: 'service'
}

// App
const app = express();
app.use(bodyParser.json());

var collection;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err){
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, function(err, client) {
  if(err) throw err;

  let db = client.db(DATABASE_NAME);
  collection = db.collection(COLLECTION_NAME);

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});


app.get('/', authenticateToken, (req, res) => {
  if (req.user.role === ROLE.ADMIN){
    collection.find({}).project({mdp:0}).toArray(function(err, docs) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(docs);
      }
    });
  }else{
    res.status(401).send('Unauthorized.');
  }
});

// On login -> service connexion asks service user to check user & pwd :
//       - If user & pwd correct : sends user role
//       - If user or pwd incorrect : sends status code 404 .
app.get('/check-user',authenticateToken ,(req, res) => {
  if(req.user.role === ROLE.SERVICE) {
    const usr = req.body.user;
    const pwd = req.body.password;

    collection.find({login: usr, mdp: pwd}).project({statut: 1}).toArray(function (err, docs) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (docs.length === 0) {
          res.status(404).send();
        } else {
          res.status(200).send(docs[0]);
        }
      }
    });
  }else{
    res.sendStatus(401);
  }
});


app.get('/:userId', authenticateToken, (req, res) => {
  let authorized = req.user.role === ROLE.ADMIN || req.user.id === req.params.userId ;
  let projection = ((req.user.id === req.params.userId) ? '' : {mdp:0}); // TODO : logique?
  if(authorized){
    collection.find({_id: ObjectId(req.params.userId)}).project(projection).toArray(function (err, docs) {
      if(err) {
        res.status(500).send(err);
      } else {
        if(docs.length === 0 ){
          res.status(404).send('Not found.');
        }else{
          res.status(200).send(docs[0]);
        }
      }
    });
  }else{
    res.status(401).send('Unauthorized.');
  }
});


app.post('/',authenticateToken,(req, res) => {
  // TODO check document format
  if(req.user.role === ROLE.ADMIN){
    let document = req.body;
    collection.insertOne(document, (err, resMongo) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resMongo.insertedId);
      }
    });
  }else{
    res.status(401).send('Unauthorized');
  }
});

// Un respo d'option ou un utilisateur peut modifier son propre profil user SAUF le champ statut (role) et _id.
// Admin peut tout changer
app.put('/:userId', authenticateToken ,(req, res) => {
  // TODO verify update content -> make sure front is also bloquing some actions
  let authorized = req.user.role === ROLE.ADMIN || req.user.id === req.params.userId ;
  let illegalOperation = ( req.user.id === req.params.userId && req.user.role !== ROLE.ADMIN && req.body.role ) ;
  if(authorized && !illegalOperation){
    let update = {$set : req.body};
    collection.updateOne({_id: ObjectId(req.params.userId)}, update, (err,resMongo) => {
      if(err) {
        res.status(400).send(err);
      } else {
        switch (resMongo.matchedCount) {
          case 0:
            res.status(404).send('No matching element found.');
            break;
          case 1:
            res.status(204).send('Element successfully updated');
            break;
        }
      }
    });
  }else{
    if(illegalOperation){
      res.send(422).send('You can\'t update your id or role.');
    }else{
      res.status(401).send('Unauthorized.');
    }
  }
});


app.delete('/:userId', authenticateToken,(req, res) => {
  if(req.user.role === ROLE.ADMIN){
    collection.deleteOne({_id: ObjectId(req.params.userId)}, (err, resMongo) => {
      if(err) {
        res.status(500).send(err);
      } else {
        // Send a 404 if no document were deleted
        res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
      }
    });
  }else{
    res.sendStatus(401);
  }
});
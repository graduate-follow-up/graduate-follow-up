'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const databaseSchema = require('./database/schema.json');

// Constants
const MONGODB_URI = 'mongodb://database_user:27017/users';
const DATABASE_NAME = 'users';
const COLLECTION_NAME = 'users';
const PORT = 80;
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

// Token verification
app.use(expressJwt({ secret: process.env.JWT_ACCESS_TOKEN_SECRET }))
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, function(err, client) {
  if(err) throw err;

  let db = client.db(DATABASE_NAME);
  collection = db.collection(COLLECTION_NAME);
  db.collection(COLLECTION_NAME).createIndex({"login": 1}, { unique:true});
  db.collection(COLLECTION_NAME).createIndex({"email": 1}, { unique:true});

  db.command( { collMod: COLLECTION_NAME,
    validator: {
      $jsonSchema : databaseSchema
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});


app.get('/', (req, res) => {
  if (req.user.role === ROLE.ADMIN) return res.sendStatus(401);

  collection.find({}).project({mdp:0}).toArray(function(err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
});

// On login -> service connexion asks service user to check user & pwd :
//       - If user & pwd correct : sends user role
//       - If user or pwd incorrect : sends status code 404 .
app.post('/check-user', (req, res) => {
  if(!(req.user.role == ROLE.SERVICE && req.user.id == 'connexion')) return res.sendStatus(401);

  const usr = req.body.user;
  const pwd = req.body.password;

  collection.find({login: usr, password: pwd }).project({ role: 1 }).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else if(docs.length === 0){
      res.status(404).send();
    } else{
      res.status(200).send(docs[0]);
    }
  });
});


app.get('/:userId', (req, res) => {
  if(req.user.role != ROLE.ADMIN && req.user.id != req.params.userId) return res.sendStatus(401);

  collection.find({_id: ObjectId(req.params.userId)}).project({mdp: 0}).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else if(docs.length === 0 ){
      res.status(404).send('Not found.');
    } else{
      res.status(200).send(docs[0]);
    }
  });
});


app.post('/', (req, res) => {
  if (req.user.role != ROLE.ADMIN) return res.sendStatus(401);

  let document = req.body;
  collection.insertOne(document, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(resMongo.insertedId);
    }
  });
});

// Un respo d'option ou un utilisateur peut modifier son propre profil user SAUF le champ statut (role) et _id.
// Admin peut tout changer
app.put('/:userId', (req, res) => {
  if(req.user.role != ROLE.ADMIN && req.user.id != req.params.userId) return res.sendStatus(401);

  // TODO verify update content -> make sure front is also bloquing some actions
  let illegalOperation = (req.user.role !== ROLE.ADMIN && req.body.role);
  
  if(illegalOperation) return res.sendStatus(403);

  let update = {$set : req.body};
  collection.updateOne({_id: ObjectId(req.params.userId)}, update, (err,resMongo) => {
    if(err) {
      res.status(400).send(err);
    } else if(resMongo.matchedCount == 0) {
      res.status(404).send('No matching element found.');
    } else {
      res.status(204).send('Element successfully updated');
    }
  });
});


app.delete('/:userId',(req, res) => {
  if (req.user.role != ROLE.ADMIN) return res.sendStatus(401);
  
  collection.deleteOne({_id: ObjectId(req.params.userId)}, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const databaseSchema = require('./database/schema.json');

// Constants
const MONGODB_URI = 'mongodb://database_user:27017/users';
const DATABASE_NAME = 'users';
const COLLECTION_NAME = 'users';
const SALT_ROUND = 0 ; // otherwise execution is too long

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

let collection;

// Token verification
app.use(expressJwt({ secret: process.env.JWT_ACCESS_TOKEN_SECRET }))
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

function log(logType, {id: actorId, role: actorRole}, subjectId) {
    axios.post('http://service_logs/', {
        "logType": logType,
        "actorId": actorId,
        "actorRole":  actorRole,
        "subjectId": subjectId
    }).catch(error => console.error(error.message));
}

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
  if (req.user.role !== ROLE.ADMIN) return res.sendStatus(401);

  collection.find({}).toArray(function(err, docs) {
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

  collection.find({login: usr}).project({ role: 1, salt : 1, hashed: 1 }).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else if(docs.length === 0){
      res.status(404).send();
    } else {
      bcrypt.compare( pwd + docs[0].salt , docs[0].hashed, function(err, response) {
        if(response) {
          delete docs[0]['salt'];
          delete docs[0]['hashed'];
          res.status(200).send(docs[0]);
        } else {
          // hash don't match
          res.status(404).send();
        }
      });
    }
  });
});


app.get('/:userId', (req, res) => {
  if(req.user.role != ROLE.ADMIN && req.user.id != req.params.userId) return res.sendStatus(401);

  collection.find({_id: ObjectId(req.params.userId)}).project({salt:0, hashed: 0}).toArray(function (err, docs) {
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
  let password = req.body.password;
  delete document['password'];

  crypto.randomBytes(256, (err, buf) => {
    if (err) return res.status(500).send(err);

    let salt = buf.toString('hex');
    document["salt"] = salt;
    bcrypt.hash(password + salt, SALT_ROUND, function(err, hash) {
      if (err) res.status(500).send(err);
      document["hashed"] = hash;
      collection.insertOne(document, (err, resMongo) => {
        if(err) {
          res.status(500).send(err);
        } else {
          log("UserCreated", req.user, resMongo.insertedId);
          res.status(200).send(resMongo.insertedId);
        }
      });
    });
  });
});


// Un respo d'option ou un utilisateur peut modifier son propre profil user SAUF le champ statut (role) et _id.
// Admin peut tout changer
app.put('/:userId', (req, res) => {
  if(req.user.role != ROLE.ADMIN && req.user.id != req.params.userId) return res.sendStatus(401);

  let illegalOperation = (req.user.role !== ROLE.ADMIN && req.body.role);
  if(illegalOperation) return res.sendStatus(403);

  let update = req.body;
  if (req.body.salt) delete update['salt'] ;
  if (req.body.hashed) delete update['hashed'];
  if (req.body.password) delete update['password'] ;
  // if (req.body.role) delete update['statut'] ;

  update = {$set : update};
  collection.updateOne({_id: ObjectId(req.params.userId)}, update, (err,resMongo) => {
    if(err) {
      res.status(400).send(err);
    } else if(resMongo.matchedCount == 0) {
      res.status(404).send('No matching element found.');
    } else {
      log("UserModified", req.user, req.params.userId);
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
      log("UserDeleted", req.user, req.params.userId);
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});

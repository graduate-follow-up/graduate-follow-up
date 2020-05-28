'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const axios = require('axios');

const databaseSchema = require('./database/schema.json');

// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';
const PORT = 80;
const ROLE = {
  USER: 'prof',
  RESPO: 'respo-option',
  ADMIN: 'administrateur',
  ALUMNI: 'alumni',
  SERVICE: 'service'
};

const SERVICE_ACCESS_TOKEN = jwt.sign({username: 'alumni',role: 'service', id: 'alumni'}, process.env.JWT_ACCESS_TOKEN_SECRET,{});
axios.defaults.headers.common['Authorization'] = 'Bearer ' + SERVICE_ACCESS_TOKEN;

// App
const app = express();
app.use(bodyParser.json());

// Token verification
app.use(expressJwt({ secret: process.env.JWT_ACCESS_TOKEN_SECRET }))
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

let collection;

function log(logType, {id: actorId, role: actorRole}, subjectId) {
    axios.post('http://service_logs/', {
        "logType": logType,
        "actorId": actorId,
        "actorRole":  actorRole,
        "subjectId": subjectId
    }).catch(error => console.error(error.message));
}

function checkIfMyself(alumniId, userId) {
  return new Promise((resolve, reject) => {
    axios.get(`http://service_user/${userId}`).then(res => {
      const {name: {
        first: userFirstname,
        last: userLastname
      }, userEmail} = res.data;

      collection.find({_id: ObjectId(alumniId)}).toArray(function (err, docs) {
        if(!err && docs.length > 0 && docs[0].first_name == userFirstname && docs[0].last_name == userLastname && docs[0].email == userEmail) {
          resolve();
        } else {
          reject();
        }
      });
    }).catch(reject);
  });
}

MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, function(err, client) {
  if(err) throw err;

  let db = client.db(DATABASE_NAME);
  collection = db.collection(COLLECTION_NAME);

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
  if (![ROLE.USER, ROLE.RESPO, ROLE.ADMIN, ROLE.SERVICE].includes(req.user.role)) return res.sendStatus(401);

  let projection = (req.user.role === ROLE.USER || req.user.role === ROLE.SERVICE) ? { first_name: 0, last_name:0, email: 0, phone: 0 } : '';

  collection.find({}).project(projection).toArray(function(err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

const idsListRegex = /^([a-f\d]{24}(,[a-f\d]{24})*)$/i;
// /infos/5ebbfc19fc13ae528a000065,5ebbfc19fc13ae528a000066
app.get('/infos/:ids', (req,res) => {
  if (!(req.user.role == ROLE.SERVICE && req.user.id == 'link')) return res.sendStatus(401);

  if(!req.params.ids.match(idsListRegex)) return res.status(400).send('Ids list required');

  const objectIdsArray = req.params.ids.split(',').map(id => ObjectId(id));

  collection.find({_id: {$in: objectIdsArray}}).project({first_name: 1, last_name: 1, email: 1}).toArray(function (err,docs){
    if(err) {
      res.status(500).send(err);
    } else {
      if (docs.length != objectIdsArray.length){
        res.status(404).send("Not found.");
      } else{
        res.status(200).send(docs);
      }
    }
  });
});

app.post('/', (req, res) => {
  if (![ROLE.RESPO, ROLE.ADMIN].includes(req.user.role)) return res.sendStatus(401);

  let document = req.body;
  collection.insertOne(document, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      log("AlumniCreated", req.user, resMongo.insertedId);
      res.status(200).send(resMongo.insertedId);
    }
  });
})

app.put('/:alumniId', (req, res) => {
  if (![ROLE.USER, ROLE.RESPO, ROLE.ADMIN, ROLE.ALUMNI].includes(req.user.role)) return res.sendStatus(401);
  if(req.user.role == ROLE.ALUMNI && req.user.id != req.params.alumniId) return res.sendStatus(401);

  const accessVerification = [ROLE.RESPO, ROLE.ADMIN, ROLE.ALUMNI].includes(req.user.role) ? Promise.resolve() : checkIfMyself(req.params.alumniId, req.user.id);

  accessVerification.then(() => {
    let update = {$set : req.body};
    collection.replaceOne({_id: ObjectId(req.params.alumniId)}, update, (err,resMongo) => {
      if(err) {
        res.status(400).send(err);
      } else if(resMongo.matchedCount == 0) {
        res.status(404).send('No matching element found.');
      } else {
        log("AlumniModified", req.user, req.params.alumniId);
        res.status(204).send('Element successfully updated');
      }
    });
  }).catch(() => { // If not authorized
    res.sendStatus(401);
  });
});

app.delete('/:alumniId', (req, res) => {
  if (![ROLE.RESPO, ROLE.ADMIN].includes(req.user.role)) return res.sendStatus(401);

  collection.deleteOne({_id: ObjectId(req.params.alumniId)}, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      log("AlumniDeleted", req.user, req.params.alumniId);
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});

app.get('/schema', (_req, res) => {
  res.status(200).send(databaseSchema);
});

app.get('/:alumniId', (req, res) => {
  if (![ROLE.USER, ROLE.RESPO, ROLE.ADMIN, ROLE.ALUMNI].includes(req.user.role)) return res.sendStatus(401);
  if(req.user.role == ROLE.ALUMNI && req.user.id != req.params.alumniId) return res.sendStatus(401);

  let projection = (req.user.role === ROLE.USER) ? { first_name: 0, last_name:0, email: 0, phone: 0 } : '';
  collection.find({_id: ObjectId(req.params.alumniId)}).project(projection).toArray(function (err, docs) {
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
});

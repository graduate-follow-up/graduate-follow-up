'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const http = require('http');

const databaseSchema = require('./database/schema.json');

// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';
const PORT = 80;
const ROLE = {
  USER: 'prof',
  RESPO: 'respo-option',
  ADMIN: 'administrateur'
}
const SERVICE_ACCESS_TOKEN = jwt.sign(
    {
      username: 'service-alumni',
      role: 'service',
      id: 'service-alumni'
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {}
);

// App
const app = express();
app.use(bodyParser.json());

var collection;

function isThisMyself(request_id,user_id, next) {
  let custom_path = '/'+user_id;
  const options = {
    host: 'service_user',
    port: 3000,
    path: custom_path,
    method: 'GET',
    family: 4,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0,
      'Authorization': 'Bearer '+ SERVICE_ACCESS_TOKEN
    }
  }

  const request = http.request(options, result => {
    let responseString = "";

    result.on("data", function (data) {
      responseString += data;
    });
    result.on("end", function () {
      if (result.statusCode === 200){
        responseString = JSON.parse(responseString);
        let user_fn = responseString.name.first;
        let user_ln = responseString.name.last;
        let user_email = responseString.email;
        collection.find({_id: ObjectId(request_id)}).toArray(function (err, alumni) {
          if(err) {
            console.log('Error while checking if myself');
            next(false);
          } else {
            if (alumni.length === 0) {
              console.log('Alumni not found.');
              next(false);
            } else {
              let res = ((alumni[0].first_name === user_fn && alumni[0].last_name === user_ln) || alumni[0].email === user_email);
              next(res);
            }
          }
        });
      }else{
        console.log('Problem with request to service-user');
        next(false);
      }
    });
  });
  request.on('error', error => {
    console.error(error);
  });
  request.write("");
  request.end();
}

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


app.get('/', authenticateToken ,(req, res) => {
  let projection = (req.user.role === ROLE.USER) ? { first_name: 0, last_name:0, email: 0, phone: 0 } : '';
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
  if(!req.params.ids.match(idsListRegex)) {
    res.status(400).send('Ids list required');
    return;
  }
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

app.get('/:alumniId', authenticateToken, (req, res) => {
  let projection = req.user.role === ROLE.USER ? { first_name: 0, last_name:0, email: 0, phone: 0 } : '' ;
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

app.post('/', authenticateToken, (req, res) => {
  if(req.user.role !== ROLE.USER){
    let document = req.body;
    collection.insertOne(document, (err, resMongo) => {
      if(err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resMongo.insertedId);
      }
    });
  }else{
    res.status(401).send('Unauthorized.');
  }
})

app.put('/:alumniId', authenticateToken, (req, res) => {

  // TODO change
  isThisMyself(req.params.alumniId, req.user.id, function (itsMe) {
    console.log(itsMe);
    // TODO exhaustive 
  if( itsMe || req.user.role !== ROLE.USER){
    let update = {$set : req.body};
    collection.replaceOne({_id: ObjectId(req.params.alumniId)}, update, (err,resMongo) => {
      if(err) {
        res.status(400).send(err);
      } else {
        switch (resMongo.matchedCount) {
          case 0:
            res.status(404).send('No matching element found.');
            break;
          case 1:
            res.status(200).send('Element successfully updated');
            break;
        }
      }
    });
  }else{
    res.status(401).send('Unauthorized.');
  }
  });
});

app.delete('/:alumniId', authenticateToken, (req, res) => {
  // TODO exhaustive 
  if(req.user.role === ROLE.USER) {
    res.sendStatus(401);
    return;
  }

  collection.deleteOne({_id: ObjectId(req.params.alumniId)}, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});

app.get('/schema', (_req, res) => {
  res.status(200).send(databaseSchema);
});
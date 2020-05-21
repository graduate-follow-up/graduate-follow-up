'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const http = require('http');




// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';
const PORT = 3000;
const ROLE = {
  USER: 'prof',
  RESPO: 'respo-option',
  ADMIN: 'administrateur'
}

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
      'Content-Length': 0
    }
  }

  const request = http.request(options, result => {
    var responseString = "";

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
            console.log("Error while checking if myself");
            next(false);
          } else {
            if (alumni.length === 0) {
              console.log("Alumni not found.");
              next(false);
            } else {
              let res = ((alumni[0].first_name === user_fn && alumni[0].last_name === user_ln) || alumni[0].email === user_email);
              next(res);
            }
          }
        });
      }else{
        console.log("Problem with request to service-user");
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

  //TODO : getTodayYear for graduation max
  db.command( { collMod: COLLECTION_NAME,
    validator: {
      $jsonSchema : {
        bsonType: "object",
        required: [ "first_name","last_name", "email", "option", "campus", "graduation" ],
        properties: {
          _id: {
            bsonType: 'objectId',
          },
          first_name: {
            bsonType: "string",
            description: "required and must be a string" },
          last_name: {
            bsonType: "string",
            description: "required and must be a string" },
          email: {
            bsonType: "string",
            description: "required and must be a string"},
          option: {
            enum: ["ICC", "IERP", "IA", "IMSI", "INEM","IFI", "DS","SECU","BI","VS", "FINTECH"],
            description: "required and must be one of those string: [ICC, IERP, IA, IMSI, INEM,IFI, DS,SECU,BI,VS, FINTECH]"},
          campus: {
            enum: [ "Pau", "Cergy" ],
            description: "required and must be Pau or Cergy" },
          graduation: {
            bsonType: "int",
            minimum: 1983,
            maximum: 2025,
            description: "must be an integer in [ 1983, actual year ] and is required"},
          company: {
            bsonType: "string",
            description: "optional and must be a string"
          }

        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});


app.get('/', authenticateToken ,(req, res) => {
  let projection = "";
  if(req.user.role === ROLE.USER){
    projection ={ first_name: 0, last_name:0, email: 0, phone: 0 };
  }
  collection.find({}).project(projection).toArray(function(err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

app.get('/:alumniId', authenticateToken , (req, res) => {
  let projection = "";
  if(req.user.role === ROLE.USER){
    projection = { first_name: 0, last_name:0, email: 0, phone: 0 };
  }
  collection.find({_id: ObjectId(req.params.alumniId)}).project(projection).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      if(docs.length === 0 ){
        res.status(404).send("Not found.");
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
    res.status(401).send("Unauthorized.");
  }
})

app.put('/:alumniId', authenticateToken, (req, res) => {

  isThisMyself(req.params.alumniId, req.user.id, function (itsMe) {
    console.log(itsMe);
  if( itsMe || req.user.role !== ROLE.USER){
    let update = {$set : req.body};
    collection.replaceOne({_id: ObjectId(req.params.alumniId)}, update, (err,resMongo) => {
      if(err) {
        res.status(400).send(err);
      } else {
        switch (resMongo.matchedCount) {
          case 0:
            res.status(404).send("No matching element found.");
            break;
          case 1:
            res.status(200).send('Element successfully updated');
            break;
        }
      }
    });
  }else{
    res.status(401).send("Unauthorized.");
  }
  });
});

app.delete('/:alumniId', authenticateToken , (req, res) => {
  if(req.user.role !== ROLE.USER){
    collection.deleteOne({"_id": ObjectId(req.params.alumniId)}, (err, resMongo) => {
      if(err) {
        res.status(500).send(err);
      } else {
        // Send a 404 if no document were deleted
        res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
      }
    });
  }else{
    res.sendStatus(401)   ;
  }
});
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';

const PORT = 3000;

// App
const app = express();
app.use(bodyParser.json());

var collection;

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


app.get('/', (req, res) => {
  // TODO check permissions
  collection.find({}).toArray(function(err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

app.get('/:alumniId', (req, res) => {
  collection.find({_id: req.params.alumniId}).toArray(function (err, docs) {
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

app.post('/', (req, res) => {
  // TODO check permissions
  // TODO verify document format
  let document = req.body;

  collection.insertOne(document, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(resMongo.insertedId);
    }
  });
})

app.put('/:alumniId', (req, res) => {
  // TODO check permissions

  // TODO verify update content
  let alumniId = req.params.alumniId;
  let update = {$set : req.body};

  collection.replaceOne({_id: alumniId}, update, (err,resMongo) => {
    if(err) {
      res.status(400).send(err);
    } else {
      switch (resMongo.matchedCount) {
        case 0:
          res.status(404).send("No matching element found.");
          break;
        case 1:
          res.status(204).send('Element successfully updated');
          break;
      }
    }
  });
});

app.delete('/:alumniId', (req, res) => {
  collection.deleteOne({"_id": req.params.alumniId}, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const databaseSchema = require('./database/schema.json');

// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';

const PORT = 80;

// App
const app = express();
app.use(bodyParser.json());

var collection;

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


app.get('/', (_req, res) => {
  // TODO check permissions
  collection.find({}).toArray(function(err, docs) {
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

app.get('/:alumniId', (req, res) => {
  collection.find({_id: ObjectId(req.params.alumniId)}).toArray(function (err, docs) {
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
          res.status(204).send('Element successfully updated');
          break;
      }
    }
  });
});

app.delete('/:alumniId', (req, res) => {
  collection.deleteOne({"_id": ObjectId(req.params.alumniId)}, (err, resMongo) => {
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
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

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});

// TODO remove
app.get('/toto/:alumniId', (req, res) => {
  collection.find({"_id": req.params.alumniId}, (err, docs) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      res.send(docs);
    }
  });
  
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

app.post('/', (req, res) => {
  // TODO check permissions
  // TODO verify document format
  let document = req.body;

  collection.insertOne(document, (err, resMongo) => {
    if(err) {
      // If not found, return 404
      res.status(500).send(err);
    } else {
      res.status(200).send(resMongo.insertedId);
    }
  });
  // TODO implement CREATE
  // req.params.alumniId
  res.status(501).send("Not implemented");
})

app.put('/:alumniId', (req, res) => {
  // TODO check permissions

  // TODO verify update content
  let update = req.body;

  collection.replaceOne({_id: req.params.alumniId}, update, (err) => {
    if(err) {
      // If not found, return 404
      res.status(400).send(err);
    } else {
      res.status(204).send(err ? 1 : 0);
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
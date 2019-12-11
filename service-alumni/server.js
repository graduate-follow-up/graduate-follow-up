'use strict';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Constants
const MONGODB_URI = 'mongodb://database_alumni:27017/alumnis';
const DATABASE_NAME = 'alumnis';
const COLLECTION_NAME = 'alumnis';

const PORT = 3000;

// App
const app = express();
var collection;

MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, function(err, client) {
  if(err) throw err;
 
  let db = client.db(DATABASE_NAME);
  collection = db.collection(COLLECTION_NAME);

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.get('/list', (req, res) => {
  collection.find({}).toArray(function(err, docs) {
    if(err) {
      res.send(err);
    } else {
      res.send(docs);
    }
  });
});
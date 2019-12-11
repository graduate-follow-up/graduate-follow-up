'use strict';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Constants
const MONGODB_URI = 'mongodb://database-alumni:27017';
const PORT = 8080;

// App
const app = express();
var mongodb;

MongoClient.connect(MONGODB_URI, function(err, database) {
  if(err) throw err;
 
  mongodb = database;

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello world\n');
});